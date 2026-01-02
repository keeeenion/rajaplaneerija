import * as PIXI from "pixi.js";

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
}

initMap("assets/map.png");