import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import type { SimulationReference } from "../simulation/reference";
import { runs, saveWorkspaceToXml } from "./editor";
import { get } from "svelte/store";
import { error } from "../store";

function buildCode(xmlText: string) {
     // Create a headless workspace
    const headlessWorkspace = new Blockly.Workspace();

    // Parse the XML string
    const xml = Blockly.utils.xml.textToDom(xmlText);

    // Load XML into workspace
    Blockly.Xml.domToWorkspace(xml, headlessWorkspace);

    // Generate JS
    const code = javascriptGenerator.workspaceToCode(headlessWorkspace);

    // Clean up workspace
    headlessWorkspace.dispose();

    return code;
}

function runBlocklyCode(code: string, simulation: SimulationReference) {
    const fn = new Function(
        'simulation',
        `"use strict";${code};return leia_teekond();`
        // `"use strict";${example_code};return leia_teekond();`
    );

    return fn(simulation);
}

export function buildSimulation(idx: number, simulation: SimulationReference) {
    const run = get(runs).find((r, i) => i === idx);
    if (!run) return;
    run.xml = saveWorkspaceToXml();

    console.log(run.xml)

    let code;
    try {
        code = buildCode(run.xml);
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