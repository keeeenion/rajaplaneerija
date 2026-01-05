import { map_parts as stage1 } from "./weights/stage1";

export interface MapNode {
  id: number;
  x: number;
  y: number;
}

export interface MapEdge {
  from: number;
  to: number;
  weight: number;
}

export interface MapData {
  map: {
    name: string;
    background: string;
    road: {
      width: number;
      laneDash: { dash: number; gap: number };
    };
    intersection: {
      size: number;
      radius: number;
      color: string;
    };
  };
  nodes: MapNode[];
  edges: MapEdge[];
}

export const mapData: MapData = {
  map: {
    name: "Tallinn",
    background: "#2f3b45",
    road: {
      width: 28,
      laneDash: {
        dash: 12, gap: 10
      },
    },
    intersection: {
      size: 36,
      radius: 8,
      color: "#2b3640",
    },
  },

  nodes: [],
  edges: [],
};

// todo: replace with get functions?
export const nodeMap = new Map<number, MapNode>();
export const adjacency: Record<number, number[]> = {};
export const weights: Record<string, number> = {};

function prepareStage(stage: number) {
  let map_parts = stage1;

  // todo additional stages

  mapData.nodes = map_parts.nodes;
  mapData.edges = map_parts.edges;

  mapData.nodes.forEach(n => {
    nodeMap.set(n.id, n);
    adjacency[n.id] = [];
  });

  mapData.edges.forEach(e => {
    adjacency[e.from].push(e.to);
    adjacency[e.to].push(e.from);
    weights[`${e.from}|${e.to}`] = e.weight;
    weights[`${e.to}|${e.from}`] = e.weight;
  });
}

prepareStage(1)