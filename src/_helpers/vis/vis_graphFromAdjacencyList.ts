import type { GraphNode, GraphEdge, GraphVisualizationData, GraphvizDotVisualizationData } from "@hediet/debug-visualizer-data-extraction";

// ── vis.js graph ─────────────────────────────────────────────────────

export function vis_graphFromAdjacencyList(adjacencyMap: Map<string, string[]>): GraphVisualizationData {
    const nodes: Map<string, GraphNode> = new Map();
    const edges: GraphEdge[] = [];

    for (const [src, targets] of adjacencyMap) {
        if (!nodes.has(src)) nodes.set(src, { id: src, label: src });
        for (const target of targets) {
            if (!nodes.has(target)) nodes.set(target, { id: target, label: target });
            edges.push({ from: src, to: target });
        }
    }

    return {
        kind: { graph: true },
        nodes: Array.from(nodes.values()),
        edges,
    };
}

(globalThis as any).vis_graphFromAdjacencyList = vis_graphFromAdjacencyList;

// ── Graphviz DOT graph (colorful) ────────────────────────────────────

const NODE_COLORS = [
    "#FF6B6B", "#FFA94D", "#FFD43B", "#69DB7C",
    "#4DABF7", "#9775FA", "#F783AC", "#38D9A9",
];

export function vis_graphFromAdjacencyList_dot(adjacencyMap: Map<string, string[]>): GraphvizDotVisualizationData {
    const lines: string[] = [
        "digraph G {",
        '  node [style="filled", shape="circle", fontcolor="white", fontname="Helvetica-Bold", fontsize=14, width=0.5, fixedsize=true];',
        '  edge [arrowsize=0.7, color="#555555"];',
    ];

    const seen = new Set<string>();
    let colorIdx = 0;

    for (const [src, targets] of adjacencyMap) {
        if (!seen.has(src)) {
            seen.add(src);
            const color = NODE_COLORS[colorIdx++ % NODE_COLORS.length];
            lines.push(`  "${src}" [label="${src}", fillcolor="${color}"];`);
        }
        for (const target of targets) {
            if (!seen.has(target)) {
                seen.add(target);
                const color = NODE_COLORS[colorIdx++ % NODE_COLORS.length];
                lines.push(`  "${target}" [label="${target}", fillcolor="${color}"];`);
            }
            lines.push(`  "${src}" -> "${target}";`);
        }
    }

    lines.push("}");

    return {
        kind: { dotGraph: true },
        text: lines.join("\n"),
    };
}

(globalThis as any).vis_graphFromAdjacencyList_dot = vis_graphFromAdjacencyList_dot;
