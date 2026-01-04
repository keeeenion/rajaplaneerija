import { javascriptGenerator } from "blockly/javascript";
import type { SimulationReference } from "../simulation/reference";
import { activeRunId, runs, saveWorkspaceToXml, workspace } from "./editor";
import { get } from "svelte/store";
import { example_code } from "./code_example";
import { error } from "../store";

function buildActiveWorkspace() {
    return javascriptGenerator.workspaceToCode(workspace);
}


function runBlocklyCode(code: string, simulation: SimulationReference) {
    const fn = new Function(
        'simulation',
        `"use strict";${code};return leia_teekond();`
        // `"use strict";${example_code};return leia_teekond();`
    );

    return fn(simulation);
}

export function buildActiveSimulation(simulation: SimulationReference) {
    const run = runs.find(r => r.id === get(activeRunId));
    if (!run) return;
    run.xml = saveWorkspaceToXml();
    console.log(run.xml)

    let code;
    try {
        code = buildActiveWorkspace();
    } catch (err: any) {
        console.error(err)
        error.set(err.message)
        alert("Probleem: " + err.message);
        return
    }

    console.log(code)

    let list;
    try {
        list = runBlocklyCode(code, simulation);
    } catch (err: any) {
        console.error(err)
        error.set(err.message)
        alert("Probleem: " + err.message);
        return;
    }
    
    if (!list) {
        const err = "Tagastatud list on tühi või olematu"
        console.error(err)
        error.set(err)
        alert("Probleem: " + err);
        return;

    }

    console.log(list)

    return list
}