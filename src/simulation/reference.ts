import { debugs } from "../store";
import { adjacency, nodeMap, weights } from "./map_data";

export interface Ristmik {
    id: string;
    neighbors: Ristmik[];

    // Algorithm helpers (Dijkstra / Greedy)
    user_distance?: number;
    user_previous?: Ristmik | null;
}

export class SimulationReference {
    A: number;
    B: number;
    runId: number;

    constructor(runId: number, pointA: number, pointB: number) {
        this.A = pointA
        this.B = pointB
        this.runId = runId
    }

    startIntersection(): number {
        return this.A;
    };

    targetIntersection(): number {
        return this.B;
    };

    distanceBetween(a: number | null, b: number | null): number {
        return weights[`${a}|${b}`] || 999999;
    };

    neighbours(a: number) {
        const exists = nodeMap.get(a);
        if (!exists) return [] // undefined maybe?
        return adjacency[a]
    };

    randomNeighbour(list: any[]) {
        const r = (a: number, b: number) => {
            if (a > b) {
                // Swap a and b to ensure a is smaller.
                var c = a;
                a = b;
                b = c;
            }
            return Math.floor(Math.random() * (b - a + 1) + a);
        }
        return list[(r(1, list.length) - 1)]
    };

    debug(...args: any[]) {
        let msg = args
            .map(arg =>
            typeof arg === 'string'
                ? arg
                : JSON.stringify(arg, null, 2)
            )
            .join(' ');
        msg = `Katse ${this.runId}: ${msg}`
        debugs.update(d => [...d, msg])
    };
}

export function getSimulationReferce(runId: number, pointA: number, pointB: number): SimulationReference {
    return new SimulationReference(runId, pointA, pointB);
}
