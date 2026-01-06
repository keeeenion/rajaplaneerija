import { get } from "svelte/store";
import { activeRunId, runs, tabName, type PreparedSim, type Run } from "./editor/editor";
import { animateVehicle, asyncVehicleAnimation, createVehicle, removeCarsFromMap } from "./simulation/car";
import { getSimulationReferce } from "./simulation/reference";
import { debugs } from "./store";
import { nodeMap } from "./simulation/map_data";
import { buildSimulation } from "./editor/compiler";
import { resolvePath } from "./simulation/map";
import { app, chosenPointA, chosenPointB } from "./simulation/simulation";
import { Stopwatch } from "./timer";
import type { Competitor } from "./competition";

function clearDebugs() {
    debugs.set([])
}

type Running = {
    controller: AbortController,
    promise: Promise<any>
}

const running: Running[] = [];

function prepareSimulation(idx: number, A: number, B: number): PreparedSim {
    // reference to the simulation
    const simulation = getSimulationReferce(idx, A, B);

    // todo: add one car to the screen and make it think
    const run = get(runs)[idx]
    const vehicle = createVehicle({
        color: run.color,
    });

    // run user code for it to derive the path to take
    const sim = buildSimulation(idx, simulation);

    if (!sim) return { vehicle, simulation, error: "Programm katkes" }
    const { list, taken } = sim;

    const valid = resolvePath([A, ...list]);
    if (!valid || !valid.length) {
        console.error("Teekond on auklik")
        return { vehicle, simulation, taken_ms: taken, error: "Teekond on auklik" }
    }

    vehicle.assignPath(valid);

    return { vehicle, simulation, taken_ms: taken };
}

async function cancelPrevious() {
    if (running.length) {
        running.forEach(r => r.controller.abort())
    }
}

function startRunner(sim: PreparedSim) {
    const controller = new AbortController();
    const runner = asyncVehicleAnimation(app, sim.vehicle, controller.signal)
        .then(() => console.log("Goal finished"))
        .catch(() => console.log("Aborted"))

    running.push({
        controller: controller,
        promise: runner,
    })

    return runner
}

export async function runSimulation() {
    await cancelPrevious();
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
    const { vehicle, error } = res;

    if (error) {
        alert(error)
        console.error(error);
        return
    }

    const controller = new AbortController();

    const runner = asyncVehicleAnimation(app, vehicle, controller.signal)
        .then(() => console.log("Goal finished"))
        .catch(() => console.log("Aborted"))

    running.push({
        controller: controller,
        promise: runner,
    })
}

export async function runAllSimulations() {
    await cancelPrevious();
    clearDebugs();
    removeCarsFromMap();

    const A = get(chosenPointA)
    const B = get(chosenPointB)

    if (!B || !A) {
        alert("Vali algus ja lõpp punktid")
        console.error("dont have A or B points");
        return;
    }

    return get(runs)
        .map((r, idx) => prepareSimulation(idx, A, B))
        .filter(s => {
            if (s.error) {
                debugs.update(d => [...d, `${tabName(s.simulation.runId)} ei jooksnud: ${s.error}`])
            }
            return !s.error
        })
        .map(s => {
            s.vehicle.spawn(nodeMap.get(A)!)
            return startRunner(s)   
        })
}

type Combine = {
    c: Competitor;
    s: PreparedSim;
    ms: number;
}

function average(c: Competitor, A: number, B: number): Combine | undefined {
    const j = 5;
    let t: number[] = [];
    let sim;

    for (let i = 1; i <= j; i++) {
        sim = prepareSimulation(c.idx, A, B)
        if (sim.error || !sim.taken_ms) return;
        t.push(sim.taken_ms)
    }

    const min = Math.min(...t);
    const max = Math.max(...t);
    t = t.filter(n => n !== min && n !== max);
    const sum = t.reduce((total, num) => total + num, 0);

    return { c, s: prepareSimulation(c.idx, A, B), ms: sum / j }
}

function voodoo(c: Competitor, A: number, B: number): Combine | undefined {
    const sim = prepareSimulation(c.idx, A, B)
    if (sim.error) return;
    return { c, s: prepareSimulation(c.idx, A, B), ms: sim.simulation.counter }
}

export async function runCompetition(A: number, B: number, competitors: Competitor[]) {
    await cancelPrevious();
    clearDebugs();
    removeCarsFromMap();

    const failed: Competitor[] = [];
    const valid: Combine[] = [];
    for (const c of competitors) {
        const s = voodoo(c, A, B);
        if (s) valid.push(s)
        if (!s) {
            failed.push(c)
            c.stopwatch.failed(true)
        }
    }

    const times = valid.map(s => s.ms);
    console.log("times", times)

    const smallest = Math.min(...times)
    const per_diff = 1;

    await Promise.all(valid.map(
        async (s) => {
            s.s.vehicle.spawn(nodeMap.get(A)!)

            const x_diff = s.ms / smallest;
            const wait_time = Math.min(per_diff * x_diff, 20)

            // console.log("wtf", s.c.idx, s.ms, wait_time, smallest, x_diff)

            // sleep
            s.c.stopwatch.start();
            s.c.stopwatch.thinking(true)
            await new Promise(resolve => setTimeout(resolve, wait_time * 1000));
            s.c.stopwatch.thinking(false)
            await startRunner(s.s)
            s.c.stopwatch.stop();
        }
    ))

    return failed
}