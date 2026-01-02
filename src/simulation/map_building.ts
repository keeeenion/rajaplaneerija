import * as PIXI from "pixi.js";
import type { MapEdge, MapNode } from "./map_data";

let nodes: MapNode[] = [];
let edges: MapEdge[] = [];

// let nodes: MapNode[] = map_parts.nodes;
// let edges: MapEdge[] = map_parts.edges;

/* =======================
   Layers
======================= */
const interactionLayer = new PIXI.Container();
const edgeLayer = new PIXI.Graphics();
const previewEdge = new PIXI.Graphics();
const nodeLayer = new PIXI.Container();

/* =======================
   State
======================= */
let draggingNode: {
    node: MapNode;
    gfx: PIXI.Graphics;
    offsetX: number;
    offsetY: number;
} | null = null;

let connectingFromId: number | null = null;

let id = 0;
function generateId() {
    return id++;
}

function getNode(id: number) {
    return nodes.find(n => n.id === id);
}

function edgeExists(a: number, b: number) {
    return edges.some(
        e =>
            (e.from === a && e.to === b) ||
            (e.from === b && e.to === a)
    );
}

/* =======================
   Geometry Helpers
======================= */
function distanceToSegment(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx === 0 && dy === 0) {
        return Math.hypot(px - x1, py - y1);
    }

    const t =
        ((px - x1) * dx + (py - y1) * dy) /
        (dx * dx + dy * dy);

    const clamped = Math.max(0, Math.min(1, t));
    const cx = x1 + clamped * dx;
    const cy = y1 + clamped * dy;

    return Math.hypot(px - cx, py - cy);
}

/* =======================
   Node Creation
======================= */
function createNode(node: MapNode) {
    const g = new PIXI.Graphics();
    g.circle(0, 0, 6).fill(0xffcc00);
    g.x = node.x;
    g.y = node.y;

    g.eventMode = "static";
    g.cursor = "pointer";

    g.on("pointerdown", e => onNodePointerDown(e, node, g));
    g.on("rightdown", () => deleteNode(node.id));
    g.on("pointermove", e => onNodePointerMove(e, node, g));
    g.on("pointerup", onNodePointerUp);
    g.on("pointerupoutside", onNodePointerUp);

    nodeLayer.addChild(g);
}

/* =======================
   Node Interaction
======================= */
function onNodePointerDown(
    e: PIXI.FederatedPointerEvent,
    node: MapNode,
    gfx: PIXI.Graphics
) {
    if (!gfx.parent) return;

    const pos = e.getLocalPosition(nodeLayer);

    // CONNECT MODE
    if (connectingFromId && connectingFromId !== node.id) {
        if (!edgeExists(connectingFromId, node.id)) {
            edges.push({ from: connectingFromId, to: node.id });
        }
        connectingFromId = null;
        previewEdge.clear();
        redrawEdges();
        return;
    }

    connectingFromId = node.id;

    draggingNode = {
        node,
        gfx,
        offsetX: gfx.x - pos.x,
        offsetY: gfx.y - pos.y,
    };
}

function onNodePointerMove(
    e: PIXI.FederatedPointerEvent,
    node: MapNode,
    gfx: PIXI.Graphics
) {
    if (!draggingNode || draggingNode.node.id !== node.id) return;

    const pos = e.getLocalPosition(nodeLayer);

    node.x = pos.x + draggingNode.offsetX;
    node.y = pos.y + draggingNode.offsetY;

    gfx.x = node.x;
    gfx.y = node.y;

    redrawEdges();
}

function onNodePointerUp() {
    draggingNode = null;
}

/* =======================
   Delete Logic
======================= */
function deleteNode(nodeId: number) {
    nodes = nodes.filter(n => n.id !== nodeId);
    edges = edges.filter(e => e.from !== nodeId && e.to !== nodeId);

    const gfx = nodeLayer.children.find(
        c => (c as any).x !== undefined && getNode(nodeId) === undefined
    );
    if (gfx) gfx.destroy();

    connectingFromId = null;
    previewEdge.clear();

    redrawAll();
}

function deleteEdge(edge: MapEdge) {
    edges = edges.filter(e => e !== edge);
    redrawEdges();
}

/* =======================
   Edge Rendering
======================= */
function redrawEdges() {
    edgeLayer.clear();

    for (const edge of edges) {
        const from = getNode(edge.from);
        const to = getNode(edge.to);
        if (!from || !to) continue;

        edgeLayer
            .moveTo(from.x, from.y)
            .lineTo(to.x, to.y)
            .stroke({
                width: 3,
                color: 0xffffff,
            });
    }
}

function redrawAll() {
    nodeLayer.removeChildren();
    for (const node of nodes) {
        createNode(node);
    }
    redrawEdges();
}

/* =======================
   Background Interaction
======================= */
function onBackgroundPointerDown(e: PIXI.FederatedPointerEvent) {
    if (e.button === 2) {
        tryDeleteEdge(e);
        return;
    }

    if (connectingFromId) {
        connectingFromId = null;
        previewEdge.clear();
        return;
    }

    const pos = e.getLocalPosition(interactionLayer);

    const node: MapNode = {
        id: generateId(),
        x: pos.x,
        y: pos.y,
    };

    nodes.push(node);
    createNode(node);
}

function tryDeleteEdge(e: PIXI.FederatedPointerEvent) {
    const pos = e.getLocalPosition(interactionLayer);

    for (const edge of edges) {
        const from = getNode(edge.from);
        const to = getNode(edge.to);
        if (!from || !to) continue;

        const dist = distanceToSegment(
            pos.x,
            pos.y,
            from.x,
            from.y,
            to.x,
            to.y
        );

        if (dist < 6) {
            deleteEdge(edge);
            return;
        }
    }
}

function onBackgroundPointerMove(e: PIXI.FederatedPointerEvent) {
    if (!connectingFromId) return;

    const from = getNode(connectingFromId);
    if (!from) return;

    const pos = e.getLocalPosition(interactionLayer);

    previewEdge.clear();
    previewEdge
        .moveTo(from.x, from.y)
        .lineTo(pos.x, pos.y)
        .stroke({ width: 2, color: 0x00ffcc });
}

/* =======================
   Public API
======================= */
export function startMapBuilding(app: PIXI.Application) {
    stopMapBuilding(app);

    app.stage.addChild(interactionLayer);
    app.stage.addChild(edgeLayer);
    app.stage.addChild(previewEdge);
    app.stage.addChild(nodeLayer);

    interactionLayer.eventMode = "static";
    interactionLayer.hitArea = app.screen;

    interactionLayer.on("pointerdown", onBackgroundPointerDown);
    interactionLayer.on("pointermove", onBackgroundPointerMove);

    redrawAll();
}

export function stopMapBuilding(app: PIXI.Application) {
    interactionLayer.removeAllListeners();
    nodeLayer.removeChildren();
}

export function resizeInteractionLayer(app: PIXI.Application) {
    interactionLayer.hitArea = app.screen;
}

export function downloadBuiltMap() {
    const blob = new Blob(
        [JSON.stringify({ nodes, edges }, null, 2)],
        { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "map.json";
    a.click();

    URL.revokeObjectURL(url);
}
