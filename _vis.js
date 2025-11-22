export function vis_arrayAsHeap(A) {
    const nodes = [];
    const edges = [];

    for (let i = 0; i < A.length; i++) {
        // node for each array element
        nodes.push({
            id: String(i),
            label: String(A[i])      // what you see on the node
        });

        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < A.length) {
            edges.push({ from: String(i), to: String(left) });
        }
        if (right < A.length) {
            edges.push({ from: String(i), to: String(right) });
        }
    }

    return {
        kind: { graph: true },
        nodes: nodes,
        edges: edges
    };
}