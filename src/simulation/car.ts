import * as PIXI from "pixi.js";
import { weights, type MapNode } from "./map_data";

interface CarDef {
  color: string;
}

export const carsLayer = new PIXI.Graphics();

export class Car {
  private path?: MapNode[];
  private segment = 0;
  private t = 0;
  private laneOffset: number;

  private sprite: PIXI.Graphics;

  public onReachGoal?: (car: Car) => void;

  constructor(def: CarDef) {
    this.sprite = new PIXI.Graphics();
    this.sprite.beginFill(Number(def.color.replace("#", "0x")));
    this.sprite.drawRoundedRect(-8, -4, 16, 8, 3);
    this.sprite.endFill();
    carsLayer.addChild(this.sprite);
    this.laneOffset = (Math.random() - 0.5) * 8;
  }

  spawn(start: MapNode) {
    this.laneOffset = (Math.random() - 0.5) * 8;
    this.sprite.position.set(start.x, start.y);
    this.sprite.rotation = 0;
  }

  assignPath(path: MapNode[]) {
    this.path = path;
  }

  update(dtMs: number) {
    if (!this.path) return;

    const a = this.path[this.segment];
    const b = this.path[this.segment + 1];

    // if there's no next node, we stop
    if (!b) {
      this.stopAtGoal();
      return;
    }

    const weight = weights[`${a.id}|${b.id}`] || 1;
    const segmentDurationMs = weight * 1000 * 0.25;

    this.t += dtMs / segmentDurationMs;

    if (this.t >= 1) {
      const overflowProgress = this.t - 1;
      this.segment++;

      if (this.segment >= this.path.length - 1) {
        this.stopAtGoal();
        return;
      }

      const nextA = this.path[this.segment];
      const nextB = this.path[this.segment + 1];
      const nextWeight = weights[`${nextA.id}|${nextB.id}`] || 1;

      const leftoverMs = overflowProgress * segmentDurationMs;
      this.t = leftoverMs / (nextWeight * 1000);
    }

    const currentA = this.path[this.segment];
    const currentB = this.path[this.segment + 1];

    const baseX = currentA.x + (currentB.x - currentA.x) * this.t;
    const baseY = currentA.y + (currentB.y - currentA.y) * this.t;

    const angle = Math.atan2(currentB.y - currentA.y, currentB.x - currentA.x);

    const offsetX = Math.cos(angle + Math.PI / 2) * this.laneOffset;
    const offsetY = Math.sin(angle + Math.PI / 2) * this.laneOffset;

    this.sprite.position.set(baseX + offsetX, baseY + offsetY);
    this.sprite.rotation = angle;
  }

  private stopAtGoal() {
    if (!this.path) return;
    const finalNode = this.path[this.path.length - 1];

    // Snap to final position (including lane offset)
    const angle = this.sprite.rotation;
    const offsetX = Math.cos(angle + Math.PI / 2) * this.laneOffset;
    const offsetY = Math.sin(angle + Math.PI / 2) * this.laneOffset;

    this.sprite.position.set(finalNode.x + offsetX, finalNode.y + offsetY);
    this.path = undefined;

    if (this.onReachGoal) {
      this.onReachGoal(this);
    }
  }
}

export function initCars(app: PIXI.Application) {
  app.stage.addChild(carsLayer);
}


export function removeCarsFromMap() {
  carsLayer.removeChildren();
}

export function createVehicle(options: CarDef) {
  return new Car(options)
}

export function animateVehicle(app: PIXI.Application, vehicle: Car) {
  app.ticker.add(ticker => {
    const dt = ticker.elapsedMS / 10;
    vehicle.update(dt)
  });
}

export async function asyncVehicleAnimation(
  app: PIXI.Application,
  vehicle: Car,
  signal?: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      app.ticker.remove(updateLoop);
      vehicle.onReachGoal = undefined;
    };

    const updateLoop = (ticker: PIXI.Ticker) => {
      const dt = ticker.elapsedMS;
      vehicle.update(dt);
    };

    if (signal) {
      if (signal.aborted) {
        return reject(new Error("Animation cancelled"));
      }
      signal.addEventListener("abort", () => {
        cleanup();
        reject(new Error("Animation cancelled"));
      }, { once: true });
    }

    vehicle.onReachGoal = () => {
      cleanup();
      resolve();
    };

    app.ticker.add(updateLoop);
  });
}