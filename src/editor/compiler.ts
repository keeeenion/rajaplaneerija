import { javascriptGenerator } from "blockly/javascript";
import type { SimulationReference } from "../simulation/reference";
import { activeRunId, runs, saveWorkspaceToXml, workspace } from "./editor";
import { get } from "svelte/store";

function buildActiveWorkspace() {
    return javascriptGenerator.workspaceToCode(workspace);
}

function runBlocklyCode(code: string, simulation: SimulationReference) {
    const fn = new Function(
        'simulation',
        `"use strict";${code};return leia_teekond(1, 2);`
    );

    return fn(simulation);
}

export function buildActiveSimulation(simulation: SimulationReference) {
    const run = runs.find(r => r.id === get(activeRunId));
    if (!run) return;
    run.xml = saveWorkspaceToXml();

    const code = buildActiveWorkspace();
    console.log(code)

    const list = runBlocklyCode(code, simulation);
    console.log(list)

    return list
}