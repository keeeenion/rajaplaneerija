export interface MapNode {
  id: string;
  x: number;
  y: number;
}

export interface MapEdge {
  from: string;
  to: string;
  width?: number;
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

  nodes: [
    {
      id: "A1", x: 100, y: 120
    },
    {
      id: "A2", x: 360, y: 120
    },
    {
      id: "A3", x: 600, y: 120
    },
    {
      id: "B1", x: 120, y: 300
    },
    {
      id: "B2", x: 360, y: 300
    },
    {
      id: "B3", x: 600, y: 300
    },
    {
      id: "C1", x: 120, y: 480
    },
    {
      id: "C2", x: 360, y: 480
    },
    {
      id: "C3", x: 600, y: 480
    },
  ],

  edges: [
    {
      from: "A1", to: "A2"
    },
    {
      from: "A2", to: "A3"
    },
    {
      from: "B1", to: "B2"
    },
    {
      from: "B2", to: "B3"
    },
    {
      from: "C1", to: "C2"
    },
    {
      from: "C2", to: "C3"
    },
    {
      from: "A1", to: "B1"
    },
    {
      from: "A2", to: "B2"
    },
    {
      from: "A3", to: "B3"
    },
    {
      from: "B1", to: "C1"
    },
    {
      from: "B2", to: "C2"
    },
    {
      from: "B3", to: "C3"
    },
  ],
};

export const nodeMap = new Map<string, MapNode>();
export const nodeDegree: Record<string, number> = {};
export const adjacency: Record<string, string[]> = {};

mapData.nodes.forEach(n => {
  nodeMap.set(n.id, n);
  nodeDegree[n.id] = 0;
  adjacency[n.id] = [];
});

mapData.edges.forEach(e => {
  nodeDegree[e.from]++;
  nodeDegree[e.to]++;
  adjacency[e.from].push(e.to);
  adjacency[e.to].push(e.from);
});