import * as Blockly from "blockly";
import * as ET from 'blockly/msg/et';
import toolbox from './toolbox'

// define blocks
// import './blocks/starting_intesection';
// import './blocks/finish_intesection';
// import './blocks/distance_between_intersections';
// import './blocks/roads_for_intersection';
import './blocks';
import { getSimulationReferce, SimulationReference } from "../simulation/reference";
import { get, writable, type Writable } from "svelte/store";
// import { template } from "./template";
import { template } from "./template_simple";
import { app, chosenPointA, chosenPointB } from "../simulation/simulation";
import { animateVehicle, Car, removeCarsFromMap, spawnVehicle } from "../simulation/car";
import { resolvePath } from "../simulation/map";
import { nodeMap } from "../simulation/map_data";
import { buildSimulation } from "./compiler";
import { debugs } from "../store";

type Run = {
    color: string;
    xml: null | string;
}

export const runs = writable<Run[]>([
    { color: "#ff0000", xml: null },
])
export const activeRunId = writable<number>(0);

// function restoreStorage() {
//     const xmllocalStorage.getItem("xmls")
// }

export function saveWorkspaceToXml() {
    const dom = Blockly.Xml.workspaceToDom(workspace);
    return Blockly.Xml.domToPrettyText(dom);
}

export function loadWorkspaceFromXml(xmlText: string | null) {
    workspace.clear();
    if (!xmlText) return;
    const dom = Blockly.utils.xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(dom, workspace);
}

export function saveCurrentTab() {
    const active = get(activeRunId);
    const currentRun = get(runs)[active];
    if (currentRun) {
        currentRun.xml = saveWorkspaceToXml();
    }
    return currentRun
}

export function chooseTab(newRunId: number) {
    saveCurrentTab();
    activeRunId.set(newRunId);

    const nextRun = get(runs)[newRunId];
    if (nextRun && nextRun.xml) {
        loadWorkspaceFromXml(nextRun.xml);
    } else if (nextRun && !nextRun.xml) {
        loadWorkspaceFromXml(template)
    }
}

export let workspace: Blockly.Workspace;

type PreparedSim = {
    vehicle: Car;
    simulation: SimulationReference;
    error?: string;
}

function clearDebugs() {
    debugs.set([])
}

function prepareSimulation(idx: number, A: number, B: number): PreparedSim {
    // reference to the simulation
    const simulation = getSimulationReferce(idx, A, B);

    // todo: add one car to the screen and make it think
    const run = get(runs)[idx]
    const vehicle = spawnVehicle({
        color: run.color,
        start: nodeMap.get(A)!,
    });
    // vehicle.thinking();

    // run user code for it to derive the path to take
    let path = buildSimulation(idx, simulation);

    const valid = resolvePath([A, ...path]);
    if (!valid) {
        console.error("path is invalid")
        return { vehicle, simulation, error: "Teekond on auklik" }
    }

    vehicle.assignPath(valid);

    return { vehicle, simulation };
}

export function runSimulation() {
    clearDebugs();
    removeCarsFromMap();

    const A = get(chosenPointA)
    const B = get(chosenPointB)

    if (!B || !A) {
        alert("Vali algus ja lõpp punktid")
        console.error("dont have A or B points");
        return;
    }

    const active = get(activeRunId);
    const res = prepareSimulation(active, A, B);
    if (!res) return;
    const { vehicle } = res;

    animateVehicle(app, vehicle)
}

export function runAllSimulations() {
    clearDebugs();
    removeCarsFromMap();
 
    const A = get(chosenPointA)
    const B = get(chosenPointB)

    if (!B || !A) {
        alert("Vali algus ja lõpp punktid")
        console.error("dont have A or B points");
        return;
    }

    const sims = get(runs)
        .map((r, idx) => prepareSimulation(idx, A, B))
        .filter(s => !s.error)
        .map(s => animateVehicle(app, s.vehicle))
}

export function initEditor() {
    const container = document.getElementById('blocklyDiv');
    if (!container) throw new Error("blocklyDiv not found");

    Blockly.setLocale(ET as any); // estonian
    workspace = Blockly.inject(container, {
        toolbox,
        move: {
            drag: true,
            scrollbars: true,
            wheel: true
        },
    });

    loadWorkspaceFromXml(template)
}