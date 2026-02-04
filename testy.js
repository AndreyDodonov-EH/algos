// Benchmark: if/else vs computed property access for tree node assignment
// Run with: npx ts-node benchmark-tree-linking.ts
// Or: npx tsx benchmark-tree-linking.ts
function createNode(value) {
    return { value: value, left: null, right: null };
}
// Build a simple balanced-ish tree for testing
function buildTree(depth, start) {
    if (start === void 0) { start = 0; }
    if (depth === 0)
        return null;
    var node = createNode(start);
    node.left = buildTree(depth - 1, start * 2 + 1);
    node.right = buildTree(depth - 1, start * 2 + 2);
    return node;
}
// Collect all parent-child pairs for benchmarking
function collectPairs(root) {
    var pairs = [];
    function traverse(node, parent, isLeft) {
        if (!node)
            return;
        if (parent) {
            pairs.push({ parent: parent, cur: node, isLeft: isLeft });
        }
        traverse(node.left, node, true);
        traverse(node.right, node, false);
    }
    traverse(root, null, false);
    return pairs;
}
// Version 1: Traditional if/else
function linkIfElse(parent, cur, nodeToBeLinked) {
    if (parent.left === cur) {
        parent.left = nodeToBeLinked;
    }
    else {
        parent.right = nodeToBeLinked;
    }
}
// Version 2: Computed property access
function linkComputed(parent, cur, nodeToBeLinked) {
    parent[parent.left === cur ? 'left' : 'right'] = nodeToBeLinked;
}
// Benchmark runner
function benchmark(name, fn, pairs, iterations) {
    // Warmup
    for (var i = 0; i < 10000; i++) {
        var _a = pairs[i % pairs.length], parent_1 = _a.parent, cur = _a.cur;
        fn(parent_1, cur, cur); // Link back to same node to keep tree intact
    }
    // Timed run
    var start = performance.now();
    for (var i = 0; i < iterations; i++) {
        var _b = pairs[i % pairs.length], parent_2 = _b.parent, cur = _b.cur;
        fn(parent_2, cur, cur);
    }
    var end = performance.now();
    return end - start;
}
// Main
function main() {
    var TREE_DEPTH = 15; // 2^15 - 1 = 32767 nodes
    var ITERATIONS = 100000000;
    var RUNS = 5;
    console.log('Building tree...');
    var tree = buildTree(TREE_DEPTH);
    var pairs = collectPairs(tree);
    console.log("Tree nodes: ".concat(pairs.length + 1));
    console.log("Iterations per run: ".concat(ITERATIONS.toLocaleString()));
    console.log("Runs: ".concat(RUNS, "\n"));
    var ifElseTimes = [];
    var computedTimes = [];
    for (var run = 1; run <= RUNS; run++) {
        console.log("--- Run ".concat(run, " ---"));
        // Alternate order to reduce bias
        if (run % 2 === 1) {
            var t1 = benchmark('if/else', linkIfElse, pairs, ITERATIONS);
            var t2 = benchmark('computed', linkComputed, pairs, ITERATIONS);
            ifElseTimes.push(t1);
            computedTimes.push(t2);
            console.log("if/else:  ".concat(t1.toFixed(2), " ms"));
            console.log("computed: ".concat(t2.toFixed(2), " ms"));
        }
        else {
            var t2 = benchmark('computed', linkComputed, pairs, ITERATIONS);
            var t1 = benchmark('if/else', linkIfElse, pairs, ITERATIONS);
            ifElseTimes.push(t1);
            computedTimes.push(t2);
            console.log("if/else:  ".concat(t1.toFixed(2), " ms"));
            console.log("computed: ".concat(t2.toFixed(2), " ms"));
        }
    }
    // Results
    var avgIfElse = ifElseTimes.reduce(function (a, b) { return a + b; }, 0) / RUNS;
    var avgComputed = computedTimes.reduce(function (a, b) { return a + b; }, 0) / RUNS;
    var diff = ((avgComputed - avgIfElse) / avgIfElse) * 100;
    console.log('\n========== RESULTS ==========');
    console.log("if/else  avg: ".concat(avgIfElse.toFixed(2), " ms"));
    console.log("computed avg: ".concat(avgComputed.toFixed(2), " ms"));
    console.log("Difference: ".concat(diff > 0 ? '+' : '').concat(diff.toFixed(2), "%"));
    console.log("Per operation: ".concat((avgIfElse / ITERATIONS * 1000000).toFixed(3), " ns vs ").concat((avgComputed / ITERATIONS * 1000000).toFixed(3), " ns"));
}
main();
