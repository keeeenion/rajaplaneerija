import * as PIXI from "pixi.js";
import { mapData, type MapNode } from "./map_data";
import { chosenPointA, chosenPointB } from "./simulation";
import { get } from "svelte/store";

const interactionLayer = new PIXI.Container();
const roadsLayer = new PIXI.Graphics();
const nodeLayer = new PIXI.Graphics();

export type IntersectionAction = 'pointA' | 'pointB'
let intersectionAction: IntersectionAction | undefined;

export function setIntersectionAction(a: IntersectionAction) {
    intersectionAction = a;
}

function chooseIntersection(
    e: PIXI.FederatedPointerEvent,
    node: MapNode,
    gfx: PIXI.Graphics
) {
    if (!gfx.parent) return;
    if (!intersectionAction) return;

    // const pos = e.getLocalPosition(roadsLayer);
    switch (intersectionAction) {
        case "pointA":
            chosenPointA.set(node.id)
            break;
        case "pointB":
            chosenPointB.set(node.id)
            break;
    }

    const points = [get(chosenPointA), get(chosenPointB)] as any;
    showOnlyRoadsAndChosenPoints(points);
    intersectionAction = undefined;
}

function getNode(id: number) {
    return mapData.nodes.find(n => n.id === id);
}

function drawEdges() {
    for (const edge of mapData.edges) {
        const from = getNode(edge.from);
        const to = getNode(edge.to);
        if (!from || !to) continue;


        // calculate alpha
        // max = 21
        // alpha range 0-1
        let alpha = Math.min(1, (edge.weight - 1) / 20);

        roadsLayer
            .moveTo(from.x, from.y)
            .lineTo(to.x, to.y)
            .stroke({
                width: 5,
                color: 0xff0000,
                alpha,
            });
    }
}

function drawNodes(numbers = false, chosen?: [number, number]) {
    for (const node of mapData.nodes) {
        const g = new PIXI.Graphics();
        let c = false;

        const A = chosen ? chosen[0] : null
        const B = chosen ? chosen[1] : null

        let color: PIXI.FillInput = 0xffcc00;
        if (A === node.id) {
            color = 0x0b42e8;
            c = true;
        }
        if (B === node.id) {
            color = 0x03a503;
            c = true;
        }

        if (chosen?.length && !c) continue;

        g.circle(0, 0, 6).fill(color);
        g.x = node.x;
        g.y = node.y;

        if (numbers) {
            const t = new PIXI.Text(node.id.toString(), { fontSize: 10, fill: 0x000000 });
            t.anchor.set(0.5);
            g.addChild(t);
        }

        g.eventMode = "static";
        g.cursor = "pointer";

        g.on("pointerdown", e => chooseIntersection(e, node, g));
        nodeLayer.addChild(g);
    }
}
export function initRoads(app: PIXI.Application) {
    app.stage.addChild(interactionLayer);
    app.stage.addChild(roadsLayer);
    app.stage.addChild(nodeLayer);

    interactionLayer.eventMode = "static";
    interactionLayer.hitArea = app.screen;
}

export function showOnlyRoads() {
    roadsLayer.clear();
    nodeLayer.removeChildren();

    drawEdges();
}

export function showOnlyIntersections(numbers = false) {
    roadsLayer.clear();
    nodeLayer.removeChildren();

    drawNodes(numbers);
}

export function showOnlyRoadsAndChosenPoints(points: [number, number]) {
    roadsLayer.clear();
    nodeLayer.removeChildren();

    drawEdges();
    drawNodes(true, points);
}

export function showMap() {
    roadsLayer.clear();
    nodeLayer.removeChildren();

    drawEdges();
    drawNodes(true);
}

export function resizeInteractionLayer(app: PIXI.Application) {
    interactionLayer.hitArea = app.screen;
}
