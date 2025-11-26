// import type { GraphNode, GraphEdge, GraphVisualizationData } from "@hediet/debug-visualizer-data-extraction";
import { GraphNode, GraphEdge, GraphVisualizationData } from "/home/andrey/_PROJECTS/vscode-debug-visualizer/data-extraction/dist"


export function vis_arrayAsHeap(A: Array<number>): GraphVisualizationData {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

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

    const graph: GraphVisualizationData = {
        kind: { graph: true },
        nodes: nodes,
        edges: edges
    };

    return  graph;
}