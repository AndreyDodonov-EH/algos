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

// convert TreeNode to the format displayable by debug visualizer
// {
//     "kind": { "graph": true },
//     "nodes": [
//         { "id": "1", "label": "1" },
//         { "id": "2", "label": "2", "color": "orange" },
//         { "id": "3", "label": "3" }
//     ],
//     "edges": [
//         { "from": "1", "to": "2", "color": "red" },
//         { "from": "1", "to": "3" }
//     ]
// }

interface GraphNode {
  id: string;
  label: string;
  color?: string;
}

interface GraphEdge {
  from: string;
  to: string;
  color?: string;
}

interface DebugVisualizerGraph {
  kind: { graph: true };
  nodes: GraphNode[];
  edges: GraphEdge[];
}

class Graph {
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

  toJSON(): DebugVisualizerGraph {
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

function fromArray(A: (number | null)[]): TreeNode | null {
    const n = A.length;
    const nodes = new Array<TreeNode | null>(n);
    for (let i=0;i<n;i++) {
        nodes[i] = (A[i] === null) ? null : new TreeNode(A[i]!);
    }
    for (let i=0;i<n;i++) {
        if (nodes[i] !== null) {
            nodes[i]!.left = (1+2*i < n) ? nodes[1+2*i] : null;
            nodes[i]!.right = (2+2*i < n) ? nodes[2+2*i] : null;
        }
    }
    return nodes[0];
}


function build (root: TreeNode | null, graph: Graph) {
    if (!root) {
        return;
    }
    graph.addNode(root.val.toString(), root.val.toString());
    build(root.left, graph);
    if (root.left) graph.addEdge(root.val.toString(), root.left.val.toString());
    build(root.right, graph);
    if (root.right) graph.addEdge(root.val.toString(), root.right.val.toString());
}

export function visul(root: TreeNode | null): void {
    // DFS + id is just incremented + lavel is val + edge is the connection beeen two element
    const graph = new Graph();
    build(root, graph);
    console.log(graph.toJSON());
    
}

function test() {
    let A = new Array<number|null>(5,3,6,2,4,null,7);
    const root = fromArray(A);
    visul(root);
}

test();