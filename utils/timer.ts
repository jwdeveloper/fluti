export class Timer {
    private intervalId: number | null = null;
    private tickInterval: number;
    private tickCallback: () => void = () => {};

    constructor(initialInterval: number = 1000) {
        this.tickInterval = initialInterval;
    }

    onTick(callback: () => void) {
        this.tickCallback = callback;
    }

    setInterval(ms: number) {
        this.tickInterval = ms;
        if (this.intervalId !== null) {
            this.stop();
            this.start();
        }
    }

    start() {
        if (this.intervalId === null) {
            this.intervalId = window.setInterval(() => {
                this.tickCallback();
            }, this.tickInterval);
        }
    }

    stop() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}