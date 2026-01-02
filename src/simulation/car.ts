import * as PIXI from "pixi.js";
import { MapNode, nodeMap } from "./map_data";

interface CarDef {
  id: string;
  color: string;
  path: number[];
  speed: number;
  trail: CarTrail;
}

interface CarTrail {
  length: number;
  width: number;
  alpha: number;
}

export class Car {
  private path: MapNode[];
  private speed: number;
  private segment = 0;
  private t = 0;
  private history: { x: number; y: number }[] = [];
  private maxHistory = 80;

  private sprite: PIXI.Graphics;
  private trail: PIXI.Graphics;

  constructor(app: PIXI.Application, def: CarDef) {
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
