import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import type { SimulationReference } from "../simulation/reference";
import { activeRunId, runs, saveWorkspaceToXml } from "./editor";
import { get } from "svelte/store";
import { error } from "../store";
import { Stopwatch } from "../timer";

function buildCode(xmlText: string) {
    const headlessWorkspace = new Blockly.Workspace();
    const xml = Blockly.utils.xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(xml, headlessWorkspace);
    const code = javascriptGenerator.workspaceToCode(headlessWorkspace);
    headlessWorkspace.dispose();
    return code;
}

function runBlocklyCode(code: string, simulation: SimulationReference) {
    const fn = new Function(
        'simulation',
        `"use strict";teekond=[];${code};return leia_teekond();`
        // `"use strict";${example_code};return leia_teekond();`
    );

    return fn(simulation);
}

export function buildSimulation(idx: number, simulation: SimulationReference): {list: number[], taken?: number} | undefined {
    const run = get(runs).find((_, i) => i === idx);
    if (!run) return;
    if (idx == get(activeRunId)) run.xml = saveWorkspaceToXml();
    if (!run.xml) return;

    const timer = new Stopwatch();

    let code;
    try {
        code = buildCode(run.xml);
    } catch (err: any) {
        console.error(err)
        error.set(err.message)
        alert("Probleem: " + err.message);
        return;
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

    const taken = timer.stop();
    
    if (!list) {
        const err = "Tagastatud list on tühi või olematu"
        console.error(err)
        error.set(err)
        alert("Probleem: " + err);
        return;

    }

    console.log(list)
    return {list, taken}
}