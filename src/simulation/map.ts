import * as PIXI from "pixi.js";

function drawBackground(app: PIXI.Application, asset: any) {
    const bg = new PIXI.Sprite(asset);

    bg.width = app.screen.width;
    bg.height = app.screen.height;

    app.stage.addChild(bg);
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
    // drawRoadsAndIntersections(mapData, g);
}