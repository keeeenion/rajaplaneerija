import { get, writable } from "svelte/store";
import { runs, type Run } from "./editor/editor";
import { prepareStage } from "./simulation/map_data";
import { showOnlyRoadsAndChosenPoints } from "./simulation/map_roads";
import { app } from "./simulation/simulation";
import { playCountdown, playGameOver } from "./simulation/visuals";
import { runCompetition } from "./runner";
import { addStopwatch, type StopwatchActions } from "./timer";
import { gameover } from "./store";

export async function playStage(stage: number, competitors: Competitor[]) {
    // prepare map and roads
    const [A, B] = prepareStage(stage);
    showOnlyRoadsAndChosenPoints([A, B]);
    return await runCompetition(A, B, competitors);
}

export type Competitor = {
    stopwatch: StopwatchActions,
    idx: number,
    run: Run,
}

export async function startCompetition() {
    gameover.set(false)
    const r = get(runs)

    let competitors: Competitor[] = r.map((c, idx) => ({
        stopwatch: addStopwatch(String(idx)),
        idx,
        run: r[idx],
    }))

    const [A, B] = prepareStage(1);
    showOnlyRoadsAndChosenPoints([A, B]);

    // play countdown
    await playCountdown(app)

    // list of maps
    const stages: number[] = [1, 2, 3, 4, 5];
    for (const stage of stages) {
        console.log("starting stage", stage)
        const failed = await playStage(stage, competitors);
        competitors = competitors.filter(c => !failed.includes(c))
    }

    console.log("game over")
    gameover.set(true)
    await playGameOver(app)
}
