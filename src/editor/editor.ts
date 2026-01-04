import * as Blockly from "blockly";
import * as ET from 'blockly/msg/et';
import toolbox from './toolbox'

// define blocks
// import './blocks/starting_intesection';
// import './blocks/finish_intesection';
// import './blocks/distance_between_intersections';
// import './blocks/roads_for_intersection';
import './blocks';
import { getSimulationReferce } from "../simulation/reference";
import { get, writable } from "svelte/store";
import { template } from "./template_simple";
import { app, chosenPointA, chosenPointB } from "../simulation/simulation";
import { animateVehicle, spawnVehicle } from "../simulation/car";
import { resolvePath } from "../simulation/map";
import { nodeMap } from "../simulation/map_data";
import { buildActiveSimulation } from "./compiler";

type Run = {
    id: number;
    name: string;
    xml: null | string;
}

export const runs: Run[] = [
    { id: 1, name: 'simulation_runs_this_file_name_1', xml: null },
    { id: 2, name: 'simulation_runs_this_file_name_2', xml: null },
    { id: 3, name: 'simulation_runs_this_file_name_3', xml: null },
    { id: 4, name: 'simulation_runs_this_file_name_4', xml: null },
    { id: 5, name: 'simulation_runs_this_file_name_5', xml: null },
];

export const activeRunId = writable<number>(1);

export function saveWorkspaceToXml() {
    const dom = Blockly.Xml.workspaceToDom(workspace);
    return Blockly.Xml.domToPrettyText(dom);
}

function loadWorkspaceFromXml(xmlText: string | null) {
    workspace.clear();
    if (!xmlText) return;
    const dom = Blockly.utils.xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(dom, workspace);
}

export function chooseTab(newRunId: number) {
    const active = get(activeRunId);
    const currentRun = runs.find(r => r.id === active);
    if (currentRun) {
        currentRun.xml = saveWorkspaceToXml();
    }

    activeRunId.set(newRunId);

    const nextRun = runs.find(r => r.id === newRunId);
    if (nextRun && nextRun.xml) {
        loadWorkspaceFromXml(nextRun.xml);
    } else if (nextRun && !nextRun.xml) {
        loadWorkspaceFromXml(template)
    }
}

export let workspace: Blockly.Workspace;

export function runSimulation() {
    const A = get(chosenPointA)
    const B = get(chosenPointB)

    if (!B || !A) {
        console.error("dont have A or B points");
        return;
    }

    // reference to the simulation
    const simulation = getSimulationReferce(A, B);

    // todo: add one car to the screen and make it think
    const vehicle = spawnVehicle(app, {
        color: "#cc1212",
        speed: 1.0,
        start: nodeMap.get(8)!,
    });
    // vehicle.thinking();

    // run user code for it to derive the path to take
    let path = buildActiveSimulation(simulation);

    path = [8, 5, 4, 3, 12];
    const valid = resolvePath(path);
    if (!valid) {
        console.error("path is invalid")
        return
    }

    vehicle.assignPath(valid);
    animateVehicle(app, vehicle)
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