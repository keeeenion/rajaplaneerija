import * as PIXI from "pixi.js";

const app = new PIXI.Application();

interface MapNode {
  id: string;
  x: number;
  y: number;
}

interface MapEdge {
  from: string;
  to: string;
  width?: number;
}

interface CarTrail {
  length: number;
  width: number;
  alpha: number;
}

interface CarDef {
  id: string;
  color: string;
  path: string[];
  speed: number;
  trail: CarTrail;
}

interface MapData {
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
  cars: CarDef[];
}

/* ---------------- MAP DATA ---------------- */

const mapData: MapData = {
  map: {
    name: "CityCenter_Final",
    background: "#2f3b45",
    road: {
      width: 28,
      laneDash: { dash: 12, gap: 10 },
    },
    intersection: {
      size: 36,
      radius: 8,
      color: "#2b3640",
    },
  },

  nodes: [
    { id: "A1", x: 100, y: 120 },
    { id: "A2", x: 360, y: 120 },
    { id: "A3", x: 600, y: 120 },
    { id: "B1", x: 120, y: 300 },
    { id: "B2", x: 360, y: 300 },
    { id: "B3", x: 600, y: 300 },
    { id: "C1", x: 120, y: 480 },
    { id: "C2", x: 360, y: 480 },
    { id: "C3", x: 600, y: 480 },
  ],

  edges: [
    { from: "A1", to: "A2" },
    { from: "A2", to: "A3" },
    { from: "B1", to: "B2" },
    { from: "B2", to: "B3" },
    { from: "C1", to: "C2" },
    { from: "C2", to: "C3" },
    { from: "A1", to: "B1" },
    { from: "A2", to: "B2" },
    { from: "A3", to: "B3" },
    { from: "B1", to: "C1" },
    { from: "B2", to: "C2" },
    { from: "B3", to: "C3" },
  ],

  cars: [
    {
      id: "blue_car",
      color: "#4fc3ff",
      path: ["B1", "B2", "A2", "A3"],
      speed: 1.5,
      trail: { length: 90, width: 4, alpha: 0.6 },
    },
    {
      id: "red_car",
      color: "#ff5252",
      path: ["C3", "B3", "B2", "B1"],
      speed: 1.2,
      trail: { length: 70, width: 4, alpha: 0.5 },
    },
    {
      id: "purple_car",
      color: "#b388ff",
      path: ["A1", "A2", "B2", "C2"],
      speed: 1.0,
      trail: { length: 60, width: 4, alpha: 0.4 },
    },
  ],
};

/* ---------------- GRAPH HELPERS ---------------- */

const nodeMap = new Map<string, MapNode>();
const nodeDegree: Record<string, number> = {};
const adjacency: Record<string, string[]> = {};

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

/* ---------------- ROAD RENDERING ---------------- */

function drawDashedLine(
  g: PIXI.Graphics,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dash: number,
  gap: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const steps = Math.floor(dist / (dash + gap));
  const ux = dx / dist;
  const uy = dy / dist;

  for (let i = 0; i < steps; i++) {
    const sx = x1 + (dash + gap) * i * ux;
    const sy = y1 + (dash + gap) * i * uy;
    g.moveTo(sx, sy);
    g.lineTo(sx + dash * ux, sy + dash * uy);
  }
}

async function drawBackground(asset: any) {
  const bg = new PIXI.Sprite(asset);

  bg.width = app.screen.width;
  bg.height = app.screen.height;

  app.stage.addChild(bg);
}

function drawRoadsAndIntersections(data: MapData, g: PIXI.Graphics) {
  data.edges.forEach(edge => {
    const a = nodeMap.get(edge.from)!;
    const b = nodeMap.get(edge.to)!;
    const roadWidth = edge.width ?? data.map.road.width;

    g.lineStyle(roadWidth + 6, 0x1e252b, 1);
    g.moveTo(a.x, a.y);
    g.lineTo(b.x, b.y);

    g.lineStyle(roadWidth, 0x3a4853, 1);
    g.moveTo(a.x, a.y);
    g.lineTo(b.x, b.y);

    g.lineStyle(2, 0xffffff, 0.35);
    drawDashedLine(
      g,
      a.x,
      a.y,
      b.x,
      b.y,
      data.map.road.laneDash.dash,
      data.map.road.laneDash.gap
    );
  });

  data.nodes.forEach(node => {
    if (nodeDegree[node.id] >= 3) {
      g.beginFill(0x2b3640);
      g.drawRoundedRect(
        node.x - data.map.intersection.size / 2,
        node.y - data.map.intersection.size / 2,
        data.map.intersection.size,
        data.map.intersection.size,
        data.map.intersection.radius
      );
      g.endFill();
    }
  });

  app.stage.addChild(g);
}

/* ---------------- CAR ---------------- */

class Car {
  private path: MapNode[];
  private speed: number;
  private segment = 0;
  private t = 0;
  private history: { x: number; y: number }[] = [];
  private maxHistory = 80;

  private sprite: PIXI.Graphics;
  private trail: PIXI.Graphics;

  constructor(def: CarDef) {
    this.path = def.path.map(id => nodeMap.get(id)!);
    this.speed = def.speed;

    this.trail = new PIXI.Graphics();
    app.stage.addChild(this.trail);

    this.sprite = new PIXI.Graphics();
    this.sprite.beginFill(Number(def.color.replace("#", "0x")));
    this.sprite.drawRoundedRect(-8, -4, 16, 8, 3);
    this.sprite.endFill();
    app.stage.addChild(this.sprite);
  }

  update(dt: number) {
    const a = this.path[this.segment];
    const b = this.path[this.segment + 1];
    if (!b) return;

    this.t += this.speed * dt * 0.01;

    if (this.t >= 1) {
      this.t = 0;
      this.segment++;

      if (this.segment >= this.path.length - 1) {
        this.segment = 0;
        this.resetTrail(a.x, a.y);
      }
    }

    const x = a.x + (b.x - a.x) * this.t;
    const y = a.y + (b.y - a.y) * this.t;
    const angle = Math.atan2(b.y - a.y, b.x - a.x);

    this.sprite.position.set(x, y);
    this.sprite.rotation = angle;

    this.recordHistory(x, y);
    this.drawTrail();
  }

  private recordHistory(x: number, y: number) {
    this.history.push({ x, y });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  private drawTrail() {
    this.trail.clear();

    for (let i = 1; i < this.history.length; i++) {
      const p0 = this.history[i - 1];
      const p1 = this.history[i];
      const alpha = i / this.history.length;

      this.trail.lineStyle(4, 0x66ccff, alpha * 0.6);
      this.trail.moveTo(p0.x, p0.y);
      this.trail.lineTo(p1.x, p1.y);
    }
  }

  private resetTrail(x: number, y: number) {
    this.history.length = 0;
    this.history.push({ x, y });
  }
}

async function initMap(map: string, resize = 4) {
  const container = document.getElementById("pixiContainer");
  if (!container) throw new Error("pixiContainer not found");

  const texture = await PIXI.Assets.load(map)

  const width = texture.width / resize;
  const height = texture.height / resize;

  container.style.width = `${width}px`;
  container.style.height = `${height}px`;

  await app.init({
    width,
    height,
    backgroundColor: 0x2f3b45,
    antialias: true,
  });

  // animate cars
  const cars = mapData.cars.map(c => new Car(c));
  app.ticker.add(ticker => {
    const dt = ticker.elapsedMS / 10;
    cars.forEach(c => c.update(dt));
  });

  container.appendChild(app.canvas);

  const g = new PIXI.Graphics();
  await drawBackground(texture)
  // drawRoadsAndIntersections(mapData, g);
}

initMap("assets/map.png");