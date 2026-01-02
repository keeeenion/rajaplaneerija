import * as Blockly from "blockly";
import toolbox from './toolbox'

// define blocks
// import './blocks/starting_intesection';
// import './blocks/finish_intesection';
// import './blocks/distance_between_intersections';
// import './blocks/roads_for_intersection';
import './blocks';
import { javascriptGenerator } from "blockly/javascript";
import { getSimulationReferce, type SimulationReference } from "../simulation/reference";

function createLeiaTeekondProcedure(workspace: Blockly.Workspace) {
    const def = Blockly.serialization.blocks.append(
        {
            type: 'procedures_defnoreturn',
            x: 150,
            y: 150,
            editable: false,
            deletable: false,
            movable: false,
            fields: {
                NAME: 'leia teekond',
            },
            extraState: {
                params: ['start', 'end'],
            },
        },
        workspace
    );
}


type Run = {
    id: number;
    name: string;
    xml: null | string;
}

const runs: Run[] = [
    { id: 1, name: 'simulation_runs_this_file_name_1', xml: null },
    { id: 2, name: 'simulation_runs_this_file_name_2', xml: null },
    { id: 3, name: 'simulation_runs_this_file_name_3', xml: null },
    { id: 4, name: 'simulation_runs_this_file_name_4', xml: null },
    { id: 5, name: 'simulation_runs_this_file_name_5', xml: null },
];

let activeRunId = 1;
updateActiveTabUI(activeRunId)

function saveWorkspaceToXml(workspace: Blockly.Workspace) {
    const dom = Blockly.Xml.workspaceToDom(workspace);
    return Blockly.Xml.domToPrettyText(dom);
}

function loadWorkspaceFromXml(
    workspace: Blockly.Workspace,
    xmlText: string | null
) {
    workspace.clear();

    if (!xmlText) return;

    const dom = Blockly.utils.xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(dom, workspace);
}

function switchRun(newRunId: number) {
    // 1. Save current tab
    const currentRun = runs.find(r => r.id === activeRunId);
    if (!currentRun) return;
    currentRun.xml = saveWorkspaceToXml(workspace);

    activeRunId = newRunId;

    const nextRun = runs.find(r => r.id === activeRunId);
    if (!nextRun) return;
    loadWorkspaceFromXml(workspace, nextRun.xml);
}

function updateActiveTabUI(active: number) {
    document.querySelectorAll<HTMLElement>('.run').forEach(el => {
        el.classList.toggle(
            'active',
            Number(el.dataset.run) === active
        );
    });
}

document.querySelectorAll<HTMLElement>('.run').forEach(el => {
    el.addEventListener('click', () => {
        const runId = Number(el.dataset.run);
        switchRun(runId);
        updateActiveTabUI(runId);
    });
});

let workspace: Blockly.Workspace;

function buildActiveWorkspace() {
    return javascriptGenerator.workspaceToCode(workspace);
}

function runBlocklyCode(code: string, simulation: SimulationReference) {
    const fn = new Function(
        'simulation',
        `"use strict";\n${code}`
    );

    return fn(simulation);
}

function runActiveSimulation(simulation: SimulationReference) {
    const run = runs.find(r => r.id === activeRunId);
    if (!run) return;
    run.xml = saveWorkspaceToXml(workspace);

    const code = buildActiveWorkspace();
    console.log(code)
    simulation.resetUserData();

    runBlocklyCode(code, simulation);
}

export function initEditor() {
    const container = document.getElementById('blocklyDiv');
    if (!container) throw new Error("blocklyDiv not found");

    workspace = Blockly.inject(container, {
        toolbox,
        move: {
            drag: true,
            scrollbars: true,
            wheel: true
        }
    });

    createLeiaTeekondProcedure(workspace);

    document.getElementById('start-simulation')?.addEventListener('click', () => {
        const simulation = getSimulationReferce();
        runActiveSimulation(simulation);
    });
}