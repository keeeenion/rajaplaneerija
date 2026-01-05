import * as PIXI from "pixi.js";
import { adjacency, nodeMap, type MapNode } from "./map_data";

function drawBackground(app: PIXI.Application, asset: any) {
    const bg = new PIXI.Sprite(asset);

    bg.width = app.screen.width;
    bg.height = app.screen.height;

    app.stage.addChild(bg);
}

export function resolvePath(path: number[]) {
    const valid: MapNode[] = [];
    for (let i=1; i < path.length; i++) {
        const prev = nodeMap.get(path[i-1]);
        const current = nodeMap.get(path[i]);
        if (!prev || !current) {
            console.error("invalid ID", prev, current)
            return undefined
        }

        const adjecent = adjacency[prev.id].includes(current.id)
        if (!adjecent) {
            console.error("not adjacent", prev.id, current.id)
            return undefined
        }

        if (i === 1) valid.push(prev)
        valid.push(current)
    }

    return valid
}

export function loadMap(app: PIXI.Application, texture: any) {
    // animate cars
    // const cars = mapData.cars.map(c => new Car(c));
    // app.ticker.add(ticker => {
    //     const dt = ticker.elapsedMS / 10;
    //     cars.forEach(c => c.update(dt));
    // });

    // const g = new PIXI.Graphics();
    drawBackground(app, texture)
}