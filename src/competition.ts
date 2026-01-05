import type { PreparedSim } from "./editor/editor";

type Competitor = {
    tab: number;
    simulation: PreparedSim
}

type Referee = {
    competitors: Competitor[]
}

export function startStage() {
    // prepare map and roads

    // animate car thinking animations
    // time each function solution
    // create prepared simulations

    // start timers
    // update UI
    // start animating

    // return times
}

export function startCompetition() {
    // list of maps
    const stages: any[] = [];
    const leaderboard = {}

    for (const stage of stages) {
        startStage();
        // add times to leaderboard
        // update UI
    }

    // create a popup of leaderboard
}
