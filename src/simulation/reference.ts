export interface Ristmik {
    id: string;
    neighbors: Ristmik[];

    // Algorithm helpers (Dijkstra / Greedy)
    user_distance?: number;
    user_previous?: Ristmik | null;
}

const A: Ristmik = { id: 'A', neighbors: [] };
const B: Ristmik = { id: 'B', neighbors: [] };
const C: Ristmik = { id: 'C', neighbors: [] };
const D: Ristmik = { id: 'D', neighbors: [] };

A.neighbors = [B, C];
B.neighbors = [A, D];
C.neighbors = [A, D];
D.neighbors = [B, C];

const EDGE_WEIGHTS = new Map<string, number>([
    ['A-B', 5],
    ['B-A', 5],

    ['A-C', 2],
    ['C-A', 2],

    ['B-D', 4],
    ['D-B', 4],

    ['C-D', 7],
    ['D-C', 7],
]);

export type SimulationReference = {
    startIntersection(): Ristmik;
    targetIntersection(): Ristmik;
    distanceBetween(a: Ristmik | null, b: Ristmik | null): number;
    resetUserData(): void;
    dumpState(): void;
}

export function getSimulationReferce(): SimulationReference {
    return {
        /* ---------------- Global nodes ---------------- */

        startIntersection(): Ristmik {
            return A;
        },

        targetIntersection(): Ristmik {
            return D;
        },

        /* ---------------- Graph logic ---------------- */

        distanceBetween(a: Ristmik | null, b: Ristmik | null): number {
            if (!a || !b) return Infinity;

            const key = `${a.id}-${b.id}`;
            return EDGE_WEIGHTS.get(key) ?? Infinity;
        },

        /* ---------------- Utilities ---------------- */

        resetUserData() {
            [A, B, C, D].forEach((n) => {
                n.user_distance = undefined;
                n.user_previous = null;
            });
        },

        /* ---------------- Debug helpers ---------------- */

        dumpState() {
            return [A, B, C, D].map((n) => ({
                id: n.id,
                distance: n.user_distance ?? Infinity,
                previous: n.user_previous?.id ?? null,
            }));
        },
    };
}
