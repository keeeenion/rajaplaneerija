import { get } from "svelte/store";
import { activeRunId, runs, tabName, type PreparedSim, type Run } from "./editor/editor";
import { animateVehicle, asyncVehicleAnimation, removeCarsFromMap, spawnVehicle } from "./simulation/car";
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
    const vehicle = spawnVehicle({
        color: run.color,
        start: nodeMap.get(A)!,
    });

    // run user code for it to derive the path to take
    const sim = buildSimulation(idx, simulation);
    
    if (!sim) return { vehicle, simulation, error: "Programm katkes" }
    const {list, taken} = sim;

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
        .map(startRunner)
}

export async function runCompetition(A: number, B: number, competitors: Competitor[]) {
    await cancelPrevious();
    clearDebugs();
    removeCarsFromMap();

    // animate car thinking animations
    // time each function solution
    // create prepared simulations

    // start timers
    // update UI
    // start animating

    // return times

    await Promise.all(competitors.map(
        async (c) => {
            const sim = prepareSimulation(c.idx, A, B)

            // todo: sim.error handle
            // add to the timer?
            c.stopwatch.start();
            await startRunner(sim)
            c.stopwatch.stop();
        }
    ))
}