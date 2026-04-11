// 1. helper to build hashmap adjancency list from edge list
function buildAdjancencyFromEdges(edges: string[][]): Map<string,string[]> {
    const adjacencyMap = new Map<string,string[]>();
    for (const edge of edges) {
        const src = edge[0];
        const target = edge[1];
        if (adjacencyMap.has(src)) {
            const targets = adjacencyMap.get(src);
            targets?.push(target);
        } else {
            adjacencyMap.set(src,[target]);
        }
    }
    return adjacencyMap;
}

// function test() {
//     const edges = [["A","B"],["B","C"],["B","E"],["C","E"],["E","D"]]
//     console.log(buildAdjancencyFromEdges(edges));
// }

// test();

// 2. helper to visualize adjancency list via debug visualizer
import { vis_graphFromAdjacencyList, vis_graphFromAdjacencyList_dot } from "../../_helpers/vis/vis_graphFromAdjacencyList";

function test() {
    const edges = [["A","B"],["B","C"],["B","E"],["C","E"],["E","D"]];
    const adj = buildAdjancencyFromEdges(edges);
    const graphVis = vis_graphFromAdjacencyList(adj);
    const dotVis = vis_graphFromAdjacencyList_dot(adj);
}

test();

