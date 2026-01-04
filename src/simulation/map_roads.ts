import * as PIXI from "pixi.js";
import { mapData, type MapEdge, type MapNode } from "./map_data";
import { chosenPointA, chosenPointB } from "./simulation";
import { get } from "svelte/store";

let nodes: MapNode[] = mapData.nodes;
let edges: MapEdge[] = mapData.edges;

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
            showIntesections();
            break;
        case "pointB":
            chosenPointB.set(node.id)
            showIntesections();
            break;
    }

    intersectionAction = undefined;
}

function getNode(id: number) {
    return nodes.find(n => n.id === id);
}

function drawEdges() {
    for (const edge of edges) {
        const from = getNode(edge.from);
        const to = getNode(edge.to);
        if (!from || !to) continue;

        // const opacity = ((edge.weight - 1) / (10 - 1)) * 100
        const alpha =  (edge.weight - 1) / 9;

        roadsLayer
            .moveTo(from.x, from.y)
            .lineTo(to.x, to.y)
            .stroke({
                width: 3,
                color: 0xff0000,
                alpha,
            });
    }
}

function drawNodes(text = false, only_chosen = false) {
    for (const node of nodes) {
        const g = new PIXI.Graphics();

        const A = get(chosenPointA);
        const B = get(chosenPointB);
        let chosen = false;

        let color: PIXI.FillInput = 0xffcc00;
        if (A === node.id) {
            color = 0x0b42e8;
            chosen = true;
        }
        if (B === node.id) {
            color = 0x03a503;
            chosen = true;
        }

        if (only_chosen && !chosen) continue;

        g.circle(0, 0, 6).fill(color);
        g.x = node.x;
        g.y = node.y;

        if (text) {
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

export function showRoads() {
    roadsLayer.clear();
    drawEdges();
}

export function showIntesections(debug = false) {
    nodeLayer.clear();
    drawNodes(debug);
}

export function showRoadsAndPoints() {
    roadsLayer.clear();
    drawEdges();

    nodeLayer.clear();
    drawNodes();
}

export function resizeInteractionLayer(app: PIXI.Application) {
    interactionLayer.hitArea = app.screen;
}
