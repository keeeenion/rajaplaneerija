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