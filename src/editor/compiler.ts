import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import type { SimulationReference } from "../simulation/reference";
import { activeRunId, runs, saveWorkspaceToXml } from "./editor";
import { get } from "svelte/store";
import { error } from "../store";
import { Stopwatch } from "../timer";

const LOOP_TIMEOUT_MS = 10000;
const LOOP_TRAP_FN = "__checkLoopTimeout";

function buildCode(xmlText: string) {
    const headlessWorkspace = new Blockly.Workspace();
    const xml = Blockly.utils.xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(xml, headlessWorkspace);
    (window as any).LoopTrap = 15000;
    javascriptGenerator.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap <= 0) throw new Error("Võimalik lõpmatu tsükkel");\n';
    const code = javascriptGenerator.workspaceToCode(headlessWorkspace);
    headlessWorkspace.dispose();
    return code;
}

function runBlocklyCode(code: string, simulation: SimulationReference) {
    const fn = new Function(
        'simulation',
        `"use strict";
        const __loopStart = Date.now();
        function ${LOOP_TRAP_FN}() {
            if (Date.now() - __loopStart > ${LOOP_TIMEOUT_MS}) {
                throw new Error("Loputu tsukkel (ajalimiit uletatud)");
            }
        }
        teekond=[];${code};return leia_teekond();`
    );
    return fn(simulation);
}

export function buildSimulation(idx: number, simulation: SimulationReference): {list: number[], taken?: number} | undefined {
    const run = get(runs).find((_, i) => i === idx);
    if (!run) return;
    if (idx == get(activeRunId)) run.xml = saveWorkspaceToXml();
    if (!run.xml) return;

    // const timer = new Stopwatch();

    let code;
    // Save the previous trap setting to be safe
    const prevTrap = javascriptGenerator.INFINITE_LOOP_TRAP;
    // Set the trap function call
    javascriptGenerator.INFINITE_LOOP_TRAP = `${LOOP_TRAP_FN}();`;
    try {
        code = buildCode(run.xml);
    } catch (err: any) {
        console.error(err)
        error.set(err.message)
        alert("Probleem: " + err.message);
        return
    } finally {
        // Restore the previous trap setting
        javascriptGenerator.INFINITE_LOOP_TRAP = prevTrap;
    }

    const timer = new Stopwatch();

    // console.log(code)

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
    console.log("taken", idx, taken)
    
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