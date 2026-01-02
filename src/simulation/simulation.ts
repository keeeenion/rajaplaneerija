import * as PIXI from "pixi.js";
import { loadMap } from "./map";
import { downloadBuiltMap, startMapBuilding, stopMapBuilding } from "./map_building";
import { displayRoads, setIntersectionAction } from "./map_roads";

const app = new PIXI.Application();

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
  container.appendChild(app.canvas);

  loadMap(app, texture)
  displayRoads(app);
}

initMap("assets/map.png");

document.getElementById('select-point-a')?.addEventListener('click', () => {
  setIntersectionAction("pointA")
});

document.getElementById('select-point-b')?.addEventListener('click', () => {
  setIntersectionAction("pointB")
});

let building = false;
document.getElementById('start-builder')?.addEventListener('click', () => {
  if (building) {
    building = false;
    return stopMapBuilding(app);
  }
  building = true;
  startMapBuilding(app)
});

document.getElementById('export-builder')?.addEventListener('click', () => {
  downloadBuiltMap();
});