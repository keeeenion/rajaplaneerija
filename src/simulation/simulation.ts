import * as PIXI from "pixi.js";
import { loadMap } from "./map";
import { initRoads, showIntersections, showRoads, showRoadsAndPoints } from "./map_roads";
import { writable } from "svelte/store";

export const app = new PIXI.Application();
export const chosenPointA = writable<number | undefined>(8)
export const chosenPointB = writable<number | undefined>(33)

export async function initSimulation(map: string, resize = 4) {
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
  container.appendChild(app.canvas);
  

  loadMap(app, texture)

  initRoads(app);
  // showIntersections(true);
  showRoads();
}

export function fullscreen() {
  const container = document.getElementById("pixiContainer");
  container?.requestFullscreen()
  // app.renderer.resize(window.width, window.innerHeight);
  // Optional: scale your stage if needed
  // app.stage.scale.x = window.innerWidth / 800;
  // app.stage.scale.y = window.innerHeight / 600;
}

