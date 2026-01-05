import * as PIXI from "pixi.js";
import { weights, type MapNode } from "./map_data";

interface CarDef {
  color: string;
  start: MapNode;
}

function deriveSpeed(weight: number) {
  const minWeight = 1;
  const maxWeight = 30;
  const minSpeed = 1.7;
  const maxSpeed = 0.5;

  // clamp weight to valid range
  weight = Math.max(minWeight, Math.min(maxWeight, weight));

  // linear interpolation
  const speed = minSpeed + ((weight - minWeight) / (maxWeight - minWeight)) * (maxSpeed - minSpeed);

  return speed;
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

    this.sprite.position.set(def.start.x, def.start.y);
    this.sprite.rotation = 0;
  }

  assignPath(path: MapNode[]) {
    this.path = path;
  }

  thinking() {
    const bubble = new PIXI.Graphics();
    bubble.beginFill(0xffffff, 0.8);
    bubble.drawCircle(0, 0, 0);
    bubble.endFill();
    bubble.position.set(this.sprite.position.x, this.sprite.position.y);
    this.sprite.addChild(bubble);
  }

  update(dt: number) {
    if (!this.path) return;

    if (this.t >= 1) {
      this.t = 0;
      this.segment++;

      // If we've reached the last node in the path
      if (this.segment >= this.path.length - 1) {
        const finalNode = this.path[this.path.length - 1];
        this.path = undefined; // Stop moving

        if (this.onReachGoal) {
          this.onReachGoal(this);
        }
        return;
      }
    }

    const a = this.path[this.segment];
    const b = this.path[this.segment + 1];
    if (!b) return;

    const weight = weights[`${a.id}|${b.id}`];
    this.t += deriveSpeed(weight) * dt * 0.01;

    const baseX = a.x + (b.x - a.x) * this.t;
    const baseY = a.y + (b.y - a.y) * this.t;

    const angle = Math.atan2(b.y - a.y, b.x - a.x);

    const offsetX = Math.cos(angle + Math.PI / 2) * this.laneOffset;
    const offsetY = Math.sin(angle + Math.PI / 2) * this.laneOffset;

    this.sprite.position.set(baseX + offsetX, baseY + offsetY);
    this.sprite.rotation = angle;
  }
}

export function initCars(app: PIXI.Application) {
  app.stage.addChild(carsLayer);
}


export function removeCarsFromMap() {
  carsLayer.removeChildren();
}

export function spawnVehicle(options: CarDef) {
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
      const dt = ticker.elapsedMS / 10;
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