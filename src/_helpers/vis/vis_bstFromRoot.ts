import type { GraphNode, GraphEdge, GraphVisualizationData, GraphvizDotVisualizationData } from "@hediet/debug-visualizer-data-extraction";

class TreeNode {
    val: number
    left: TreeNode | null
    right: TreeNode | null
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.left = (left === undefined ? null : left)
        this.right = (right === undefined ? null : right)
    }
}

// ── vis.js graph (original) ──────────────────────────────────────────

class Graph {
    constructor(root: TreeNode | null) {
        this.build(root);
    }

    private counter = 0;

    private build(root: TreeNode | null): string | null {
        if (!root) return null;

        const id = `node_${this.counter++}`;
        this.addNode(id, root.val.toString());

        const hasAnyChild = root.left || root.right;

        if (hasAnyChild) {
            if (root.left) {
                const leftId = this.build(root.left);
                if (leftId) this.addEdge(id, leftId);
            } else {
                const nullId = `null_${this.counter++}`;
                this.addNode(nullId, "null", "#cccccc");
                this.addEdge(id, nullId, "#cccccc");
            }

            if (root.right) {
                const rightId = this.build(root.right);
                if (rightId) this.addEdge(id, rightId);
            } else {
                const nullId = `null_${this.counter++}`;
                this.addNode(nullId, "null", "#cccccc");
                this.addEdge(id, nullId, "#cccccc");
            }
        }

        return id;
    }

    private nodes: Map<string, GraphNode> = new Map();
    private edges: GraphEdge[] = [];

    addNode(id: string, label?: string, color?: string): this {
        const node: GraphNode = { id, label: label ?? id };
        if (color) node.color = color;
        this.nodes.set(id, node);
        return this;
    }

    addEdge(from: string, to: string, color?: string): this {
        const edge: GraphEdge = { from, to };
        if (color) edge.color = color;
        this.edges.push(edge);
        return this;
    }

    toJSON(): GraphVisualizationData {
        return {
            kind: { graph: true },
            nodes: Array.from(this.nodes.values()),
            edges: this.edges,
        };
    }

    toString(): string {
        return JSON.stringify(this.toJSON());
    }
}

export function vis_bstFromRoot(root: TreeNode | null): GraphVisualizationData {
    const graph = new Graph(root);
    return graph.toJSON();
}

(globalThis as any).vis_bstFromRoot = vis_bstFromRoot;

// ── Graphviz DOT graph (colorful) ────────────────────────────────────

// Depth-based palette — each level gets its own fill color.
const DEPTH_COLORS = [
    "#FF6B6B", // 0  red
    "#FFA94D", // 1  orange
    "#FFD43B", // 2  yellow
    "#69DB7C", // 3  green
    "#4DABF7", // 4  blue
    "#9775FA", // 5  violet
    "#F783AC", // 6  pink
    "#38D9A9", // 7  teal
];

function pickColor(depth: number): string {
    return DEPTH_COLORS[depth % DEPTH_COLORS.length];
}

function buildDot(root: TreeNode | null): string {
    const lines: string[] = [
        "digraph BST {",
        '  graph [ordering="out"];',
        '  node [style="filled", shape="circle", fontcolor="white", fontname="Helvetica-Bold", fontsize=14, width=0.5, fixedsize=true];',
        '  edge [arrowsize=0.7, color="#555555"];',
    ];

    let counter = 0;

    function walk(node: TreeNode | null, depth: number): string | null {
        if (!node) return null;

        const id = `n${counter++}`;
        const color = pickColor(depth);
        lines.push(`  ${id} [label="${node.val}", fillcolor="${color}"];`);

        const hasChild = node.left || node.right;
        if (hasChild) {
            if (node.left) {
                const leftId = walk(node.left, depth + 1);
                if (leftId) lines.push(`  ${id} -> ${leftId};`);
            } else {
                const nullId = `null${counter++}`;
                lines.push(`  ${nullId} [label="", shape="point", width=0.15, fillcolor="#cccccc"];`);
                lines.push(`  ${id} -> ${nullId} [style="dashed", color="#cccccc"];`);
            }

            if (node.right) {
                const rightId = walk(node.right, depth + 1);
                if (rightId) lines.push(`  ${id} -> ${rightId};`);
            } else {
                const nullId = `null${counter++}`;
                lines.push(`  ${nullId} [label="", shape="point", width=0.15, fillcolor="#cccccc"];`);
                lines.push(`  ${id} -> ${nullId} [style="dashed", color="#cccccc"];`);
            }
        }

        return id;
    }

    walk(root, 0);
    lines.push("}");
    return lines.join("\n");
}

/**
 * Colorful Graphviz DOT visualization of a BST.
 * Use this in the Debug Visualizer with the "Graphviz dot" viewer.
 *
 * Nodes are colored by depth — each level gets a distinct fill color.
 */
export function vis_bstFromRoot_dot(root: TreeNode | null): GraphvizDotVisualizationData {
    return {
        kind: { dotGraph: true },
        text: buildDot(root),
    };
}

(globalThis as any).vis_bstFromRoot_dot = vis_bstFromRoot_dot;