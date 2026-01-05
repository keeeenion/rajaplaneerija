import * as Blockly from "blockly";
import * as ET from 'blockly/msg/et';
import toolbox from './toolbox'

// define blocks
// import './blocks/starting_intesection';
// import './blocks/finish_intesection';
// import './blocks/distance_between_intersections';
// import './blocks/roads_for_intersection';
import './blocks';
import { SimulationReference } from "../simulation/reference";
import { get, writable } from "svelte/store";
// import { template } from "./template";
import { template } from "./template_simple";
import { Car} from "../simulation/car";

export type Run = {
    color: string;
    xml: null | string;
    name?: string;
}

export const runs = writable<Run[]>([
    { color: "#ff0000", xml: null },
])
export const activeRunId = writable<number>(0);

export function tabName(idx: number) {
    const rs = get(runs)
    const r = rs[idx]
    return r.name ?? `Katse ${idx}`
}

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

export type PreparedSim = {
    vehicle: Car;
    simulation: SimulationReference;
    error?: string;
    taken_ms?: number;
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