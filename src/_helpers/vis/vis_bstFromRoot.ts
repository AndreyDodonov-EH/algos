import type { GraphNode, GraphEdge, GraphVisualizationData } from "@hediet/debug-visualizer-data-extraction";

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

class Graph {
    constructor(root: TreeNode | null) {
        this.build(root);
    }

    private counter = 0;

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