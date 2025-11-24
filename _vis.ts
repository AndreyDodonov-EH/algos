interface Node {
    id: number;
    label: string;
}

interface Edge {
    from: number;
    to: number;
}

interface VisGraph {
    kind: { graph: true };
    nodes: Node[];
    edges: Edge[];
}

export function vis_arrayAsHeap(A: Int32Array) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    for (let i = 0; i < A.length; i++) {
        // node for each array element
        nodes.push({
            id: i,
            label: String(A[i])      // what you see on the node
        });

        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < A.length) {
            edges.push({ from: i, to: left });
        }
        if (right < A.length) {
            edges.push({ from: i, to: right });
        }
    }

    const graph: VisGraph = {
        kind: { graph: true },
        nodes: nodes,
        edges: edges
    };

    return  graph;
}