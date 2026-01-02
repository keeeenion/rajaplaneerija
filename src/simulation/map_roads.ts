import * as PIXI from "pixi.js";
import { mapData, type MapEdge, type MapNode } from "./map_data";

let nodes: MapNode[] = mapData.nodes;
let edges: MapEdge[] = mapData.edges;

const interactionLayer = new PIXI.Container();
const roadsLayer = new PIXI.Graphics();

type IntersectionAction = 'pointA' | 'pointB'
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
    alert(node.id)
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

        roadsLayer
            .moveTo(from.x, from.y)
            .lineTo(to.x, to.y)
            .stroke({
                width: 3,
                color: 0xffffff,
            });
    }
}

function drawNode(node: MapNode) {
    const g = new PIXI.Graphics();
    g.circle(0, 0, 6).fill(0xffcc00);
    g.x = node.x;
    g.y = node.y;

    g.eventMode = "static";
    g.cursor = "pointer";

    g.on("pointerdown", e => chooseIntersection(e, node, g));
    roadsLayer.addChild(g);
}

function redrawAll() {
    roadsLayer.clear();
    for (const node of nodes) {
        drawNode(node);
    }
    drawEdges();
}

export function displayRoads(app: PIXI.Application) {
    app.stage.addChild(interactionLayer);
    app.stage.addChild(roadsLayer);

    interactionLayer.eventMode = "static";
    interactionLayer.hitArea = app.screen;

    redrawAll();
}

export function resizeInteractionLayer(app: PIXI.Application) {
    interactionLayer.hitArea = app.screen;
}
