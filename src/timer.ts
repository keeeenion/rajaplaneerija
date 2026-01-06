import { writable, type Readable } from 'svelte/store';

export class Stopwatch {
    startTime;

    constructor() {
        this.startTime = performance.now()
    }

    stop() {
        const endTime = performance.now()
        return endTime - this.startTime;
    }
}
export interface StopwatchState {
    id: string;
    elapsed: number;
    running: boolean;
    thinking: boolean;
    failed: boolean;
}

export interface StopwatchActions {
    subscribe: Readable<StopwatchState>['subscribe'];
    start: () => void;
    thinking: (b: boolean) => void;
    failed: (b: boolean) => void;
    stop: () => void;
    reset: () => void;
}

export const stopwatchList = writable<StopwatchActions[]>([]);

export function createStopwatch(id: string): StopwatchActions {
    const { subscribe, update } = writable<StopwatchState>({
        id,
        elapsed: 0,
        running: false,
        thinking: false,
        failed: false
    });

    let interval: ReturnType<typeof setInterval> | undefined;

    const actions: StopwatchActions = {
        subscribe,
        start: () => {
            update(s => {
                if (s.running) return s;
                interval = setInterval(() => {
                    update(state => ({ ...state, elapsed: state.elapsed + 10 }));
                }, 10);
                return { ...s, running: true };
            });
        },
        stop: () => {
            if (interval) clearInterval(interval);
            update(s => ({ ...s, running: false }));
        },
        reset: () => {
            update(s => ({ ...s, elapsed: 0, running: false }));
        },
        thinking: (b: boolean) => {
            update(s => ({ ...s, thinking: b }));
        },
        failed: (b: boolean) => {
            update(s => ({ ...s, failed: b }));
        }
    };

    return actions;
}

export function addStopwatch(id: string) {
    const newWatch = createStopwatch(id);
    stopwatchList.update(list => [...list, newWatch]);
    return newWatch;
}
