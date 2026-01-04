import * as PIXI from "pixi.js";
import { loadMap } from "./map";
import { initRoads, showIntesections, showRoadsAndPoints } from "./map_roads";
import { writable } from "svelte/store";

export const app = new PIXI.Application();
export const chosenPointA = writable<number | undefined>()
export const chosenPointB = writable<number | undefined>()

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
  showRoadsAndPoints();
  showIntesections();
}
