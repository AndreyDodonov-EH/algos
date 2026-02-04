// Benchmark: if/else vs computed property access for tree node assignment
// Run with: npx ts-node benchmark-tree-linking.ts
// Or: npx tsx benchmark-tree-linking.ts

interface TreeNode {
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
}

function createNode(value: number): TreeNode {
    return { value, left: null, right: null };
}

// Build a simple balanced-ish tree for testing
function buildTree(depth: number, start = 0): TreeNode | null {
    if (depth === 0) return null;
    const node = createNode(start);
    node.left = buildTree(depth - 1, start * 2 + 1);
    node.right = buildTree(depth - 1, start * 2 + 2);
    return node;
}

// Collect all parent-child pairs for benchmarking
function collectPairs(root: TreeNode | null): Array<{ parent: TreeNode; cur: TreeNode; isLeft: boolean }> {
    const pairs: Array<{ parent: TreeNode; cur: TreeNode; isLeft: boolean }> = [];
    
    function traverse(node: TreeNode | null, parent: TreeNode | null, isLeft: boolean) {
        if (!node) return;
        if (parent) {
            pairs.push({ parent, cur: node, isLeft });
        }
        traverse(node.left, node, true);
        traverse(node.right, node, false);
    }
    
    traverse(root, null, false);
    return pairs;
}

// Version 1: Traditional if/else
function linkIfElse(parent: TreeNode, cur: TreeNode, nodeToBeLinked: TreeNode | null): void {
    if (parent.left === cur) {
        parent.left = nodeToBeLinked;
    } else {
        parent.right = nodeToBeLinked;
    }
}

// Version 2: Computed property access
function linkComputed(parent: TreeNode, cur: TreeNode, nodeToBeLinked: TreeNode | null): void {
    parent[parent.left === cur ? 'left' : 'right'] = nodeToBeLinked;
}

// Benchmark runner
function benchmark(
    name: string,
    fn: (parent: TreeNode, cur: TreeNode, nodeToBeLinked: TreeNode | null) => void,
    pairs: Array<{ parent: TreeNode; cur: TreeNode }>,
    iterations: number
): number {
    // Warmup
    for (let i = 0; i < 10000; i++) {
        const { parent, cur } = pairs[i % pairs.length];
        fn(parent, cur, cur); // Link back to same node to keep tree intact
    }

    // Timed run
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        const { parent, cur } = pairs[i % pairs.length];
        fn(parent, cur, cur);
    }
    const end = performance.now();

    return end - start;
}

// Main
function main() {
    const TREE_DEPTH = 15; // 2^15 - 1 = 32767 nodes
    const ITERATIONS = 100_000_000;
    const RUNS = 5;

    console.log('Building tree...');
    const tree = buildTree(TREE_DEPTH)!;
    const pairs = collectPairs(tree);
    console.log(`Tree nodes: ${pairs.length + 1}`);
    console.log(`Iterations per run: ${ITERATIONS.toLocaleString()}`);
    console.log(`Runs: ${RUNS}\n`);

    const ifElseTimes: number[] = [];
    const computedTimes: number[] = [];

    for (let run = 1; run <= RUNS; run++) {
        console.log(`--- Run ${run} ---`);

        // Alternate order to reduce bias
        if (run % 2 === 1) {
            const t1 = benchmark('if/else', linkIfElse, pairs, ITERATIONS);
            const t2 = benchmark('computed', linkComputed, pairs, ITERATIONS);
            ifElseTimes.push(t1);
            computedTimes.push(t2);
            console.log(`if/else:  ${t1.toFixed(2)} ms`);
            console.log(`computed: ${t2.toFixed(2)} ms`);
        } else {
            const t2 = benchmark('computed', linkComputed, pairs, ITERATIONS);
            const t1 = benchmark('if/else', linkIfElse, pairs, ITERATIONS);
            ifElseTimes.push(t1);
            computedTimes.push(t2);
            console.log(`if/else:  ${t1.toFixed(2)} ms`);
            console.log(`computed: ${t2.toFixed(2)} ms`);
        }
    }

    // Results
    const avgIfElse = ifElseTimes.reduce((a, b) => a + b, 0) / RUNS;
    const avgComputed = computedTimes.reduce((a, b) => a + b, 0) / RUNS;
    const diff = ((avgComputed - avgIfElse) / avgIfElse) * 100;

    console.log('\n========== RESULTS ==========');
    console.log(`if/else  avg: ${avgIfElse.toFixed(2)} ms`);
    console.log(`computed avg: ${avgComputed.toFixed(2)} ms`);
    console.log(`Difference: ${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`);
    console.log(`Per operation: ${(avgIfElse / ITERATIONS * 1_000_000).toFixed(3)} ns vs ${(avgComputed / ITERATIONS * 1_000_000).toFixed(3)} ns`);
}

main();