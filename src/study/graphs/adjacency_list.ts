import { vis_graphFromAdjacencyList, vis_graphFromAdjacencyList_dot } from "../../_helpers/vis/vis_graphFromAdjacencyList";
import { Queue } from "@datastructures-js/queue";
type Adj = Map<string,string[]>;

function buildAdjFromEdges(edges: string[][]): Adj {
    const AdjList = new Map<string,string[]>();
    for (const edge of edges) {
        const src = edge[0];
        const target = edge[1];
        if (AdjList.has(src)) {
            const targets = AdjList.get(src);
            targets?.push(target);
        } else {
            AdjList.set(src,[target]);
        }
    }
    return AdjList;
}


function countPaths(start: string, target: string, adjList: Adj): number {
    // count possible paths via dfs
    // rule of thumb: for counting paths use dfs, since we anyway need to visit all, for finding shortest, use bfs, i.e. sonar :-)
    const visited = new Set<string>();
    function dfs(node: string): number {
        if (visited.has(node)) return 0;
        if (node === target) return 1;
        let count = 0;
        const neighbours = adjList.get(node) ?? [];
        visited.add(node);
        for (const neighbour of neighbours) {
            count += dfs(neighbour);
        }
        visited.delete(node);
        return count;
    }
    return dfs(start);
}

function shortestPath(start: string, target: string, adjList: Adj): number {
    // find shortest path bia bfs
    // use queue of neighbours
    let len = 0;
    const q = new Queue<string>();
    q.push(start);
    // visited is used not only to prevent loops
    // (like in dfs)
    // but also to check if we could have arrived here earlier
    const visited = new Set<string>();
    visited.add(start);
    while (q.size() > 0) {
        const size = q.size();
        for (let i=0;i<size;i++) {
            const crt = q.pop()!;
            if (crt === target) return len;
            visited.add(crt);
            const ns = adjList.get(crt) ?? [];
            for (const n of ns) {
                if (visited.has(n)) continue;
                q.push(n);
                visited.add(n);
            }
        }
        len++;
    }
    return -1;
}



function test() {
    const edges = [["A","B"],["B","C"],["B","E"],["C","E"],["E","D"]];
    const adj = buildAdjFromEdges(edges);
    const graphVis = vis_graphFromAdjacencyList(adj);
    const dotVis = vis_graphFromAdjacencyList_dot(adj);

    console.log(countPaths("A","E",adj));
    console.log(shortestPath("A","E",adj));
}

test();
