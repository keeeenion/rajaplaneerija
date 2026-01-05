import { get, writable } from "svelte/store";
import { runs, type PreparedSim, type Run } from "./editor/editor";
import { prepareStage } from "./simulation/map_data";
import { showOnlyRoads, showOnlyRoadsAndChosenPoints } from "./simulation/map_roads";
import { competing } from "./store";
import { app } from "./simulation/simulation";
import { playCountdown } from "./simulation/countdown";
import { runCompetition } from "./runner";

type Timer = {
    name: string
    color: string
    timer_s: number
}

export const timers = writable<Timer[]>([
    { name: "Roosmarii", color: "#d612b5ff", timer_s: 0 },
    { name: "Madis", color: "#18d47cff", timer_s: 0},
    { name: "Timofey", color: "#1020adff", timer_s: 0 },
    { name: "Kristjan", color: "#7b0e0eff", timer_s: 0 },
    { name: "Armin", color: "#9a0997ff", timer_s: 0 }
])

export async function playStage(stage: number, competitors: Run[]) {
    // prepare map and roads
    const [A, B] = prepareStage(stage);
    showOnlyRoadsAndChosenPoints([A, B]);

    // play countdown
    await playCountdown(app)

    await runCompetition(A, B, competitors);
    // animate car thinking animations
    // time each function solution
    // create prepared simulations

    // start timers
    // update UI
    // start animating

    // return times
}

export async function startCompetition() {
    competing.set(true)

    await new Promise(resolve => setTimeout(resolve, 3000));

    // list of maps
    const stages: number[] = [1, 2, 3, 4, 5];
    const leaderboard = {}

    const competitors = get(runs)

    for (const stage of stages) {
        console.log("starting stage", stage)
        await playStage(stage, competitors);
        // add times to leaderboard
        // update UI
    }

    // create a popup of leaderboard
    console.log("game over")
    competing.set(false)
}
