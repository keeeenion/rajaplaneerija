import { writable } from "svelte/store";
import type { PreparedSim } from "./editor/editor";
import { prepareStage } from "./simulation/map_data";
import { showOnlyRoads } from "./simulation/map_roads";

type Timer = {
    name: string
    color: string
}

export const timers = writable<Timer[]>([
    { name: "Roosmarii", color: "#d612b5ff" },
    { name: "Madis", color: "#18d47cff" },
    { name: "Timofey", color: "#1020adff" },
    { name: "Kristjan", color: "#7b0e0eff" },
    { name: "Armin", color: "#9a0997ff" }
])

type Competitor = {
    tab: number;
    simulation: PreparedSim
}

type Referee = {
    competitors: Competitor[]
}

export async function playStage(stage: number) {
    // prepare map and roads
    prepareStage(stage);
    showOnlyRoads();

    await new Promise(resolve => setTimeout(resolve, 1500));

    // animate car thinking animations
    // time each function solution
    // create prepared simulations

    // start timers
    // update UI
    // start animating

    // return times
}

export async function startCompetition() {
    // list of maps
    const stages: number[] = [1, 2, 3, 4, 5];
    const leaderboard = {}

    for (const stage of stages) {
        console.log("starting stage", stage)
        await playStage(stage);
        // add times to leaderboard
        // update UI
    }

    // create a popup of leaderboard
    console.log("game over")
}
