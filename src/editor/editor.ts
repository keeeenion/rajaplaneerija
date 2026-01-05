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

type PersistedState = {
    runs: Run[];
    activeRunId: number;
};

export const runs = writable<Run[]>([
    { color: "#ff0000", xml: null },
])
export const activeRunId = writable<number>(0);

const STORAGE_KEY = "rajaplaneerija:workspace";
let persistenceReady = false;
let isRestoring = false;

function persistState() {
    if (typeof localStorage === "undefined") return;
    try {
        const snapshot: PersistedState = {
            runs: get(runs),
            activeRunId: get(activeRunId),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
        console.warn("Failed to persist workspace", error);
    }
}

function loadPersistedState(): PersistedState | null {
    if (typeof localStorage === "undefined") return null;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as PersistedState;
        if (!parsed || !Array.isArray(parsed.runs) || typeof parsed.activeRunId !== "number") {
            return null;
        }
        const runsSanitized = parsed.runs.filter((run) => {
            return run && typeof run.color === "string" && ("xml" in run);
        });
        if (!runsSanitized.length) return null;
        return {
            runs: runsSanitized,
            activeRunId: parsed.activeRunId,
        };
    } catch (error) {
        console.warn("Failed to load persisted workspace", error);
        return null;
    }
}

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
    let currentRun: Run | undefined;
    runs.update((r) => {
        if (r[active]) {
            r[active].xml = saveWorkspaceToXml();
            currentRun = r[active];
        }
        return r;
    });
    return currentRun;
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

    isRestoring = true;
    const persisted = loadPersistedState();
    if (persisted) {
        runs.set(persisted.runs);
        const activeId = Math.max(0, Math.min(persisted.activeRunId, persisted.runs.length - 1));
        activeRunId.set(activeId);
        const initialRun = persisted.runs[activeId];
        if (initialRun?.xml) {
            loadWorkspaceFromXml(initialRun.xml);
        } else {
            loadWorkspaceFromXml(template);
        }
    } else {
        loadWorkspaceFromXml(template);
    }
    isRestoring = false;

    if (!persistenceReady) {
        persistenceReady = true;
        runs.subscribe(() => {
            if (isRestoring) return;
            persistState();
        });
        activeRunId.subscribe(() => {
            if (isRestoring) return;
            persistState();
        });
        window.addEventListener("beforeunload", () => {
            saveCurrentTab();
            persistState();
        });
    }

    workspace.addChangeListener((event) => {
        if (event.isUiEvent) return;
        saveCurrentTab();
    });
}