import { tabName } from "../editor/editor";
import { debugs } from "../store";
import { adjacency, nodeMap, weights } from "./map_data";

export interface Ristmik {
    id: string;
    neighbors: Ristmik[];

    // Algorithm helpers (Dijkstra / Greedy)
    user_distance?: number;
    user_previous?: Ristmik | null;
}

type MemoryEntry = {
    visited?: boolean;
    discovered?: boolean;
    distance?: number;
    previous?: number;
};

export class SimulationReference {
    A: number;
    B: number;
    runId: number;

    private memory = new Map<number, MemoryEntry>;

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
        msg = `${tabName(this.runId)}: ${msg}`
        debugs.update(d => [...d, msg])
    };

    setter(ristmik: number, key: string, value: any) {
        let entry = this.memory.get(ristmik)
        if (!entry) entry = {}

        const r = nodeMap.get(ristmik);
        if (!r) throw new Error(`Määratud ristmik ${ristmik} ei eksisteeri`)

        switch (key) {
            case 'KAUGUS': entry.distance = value; break;
            case 'EELMINE_RISTMIK': entry.previous = value; break;
            case 'KAS_KÜLASTATUD': entry.visited = value; break;
            case 'KAS_AVASTATUD': entry.discovered = value; break;
        }

        this.memory.set(ristmik, entry)
    };

    getter(ristmik: number, key: string) {
        let entry = this.memory.get(ristmik)

        const r = nodeMap.get(ristmik);
        if (!r) throw new Error(`Küsitud ristmik ${ristmik} ei eksisteeri`)

        switch (key) {
            case 'NUMBER':
                return ristmik
            case 'NAABER':
                return adjacency[ristmik]
            case 'KOORDINAAT':
                return [r.x, r.y]
            case 'KAUGUS':
                return (entry && entry.distance != undefined) ? entry.distance : 99999
            case 'EELMINE_RISTMIK':
                return (entry && entry.previous != undefined) ? entry.previous : 0
            case 'KAS_KÜLASTATUD':
                return entry?.visited
            case 'KAS_AVASTATUD':
                return entry?.discovered
        }
    };

    pythagoras(a: number, b: number) {
        const ristmik_a = nodeMap.get(a)
        const ristmik_b = nodeMap.get(b)

        if (!ristmik_a || !ristmik_b) throw new Error(`Mitte eksisteeriv ristmik sirgjoonelise funktsiooni sisendis`);

        const x1 = ristmik_a.x
        const x2 = ristmik_b.x
        const y1 = ristmik_a.y
        const y2 = ristmik_b.y

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return Math.ceil(dist)
    };

    allIntersections() {
        return Array.from(nodeMap.keys()).sort((a, b) => a - b);
    }

    greedy_distance(ristmik: number, mode: string) {
        const r = nodeMap.get(ristmik)
        if (!r) throw new Error(`Ristmik ${ristmik} ei eksisteeri, et leida ${mode} naaber`)

        const neighbours = adjacency[r.id]
        const times = neighbours.map(n => weights[`${r.id}|${n}`])
        const value = (mode === "VÄIKSEMA")
            ? Math.min(...times)
            : Math.max(...times)
        const index = times.findIndex(t => t === value)
        return neighbours[index]
    }
}

export function getSimulationReferce(runId: number, pointA: number, pointB: number): SimulationReference {
    return new SimulationReference(runId, pointA, pointB);
}
