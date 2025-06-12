export interface Cancelable<T> {
    isCanceled: boolean;
    event: T
}

export interface EventServiceConfig {
    autoFire: boolean
}

export class EventsService {
    private eventsMap = new Map<string, Set<(payload: any) => void>>();
    private eventQueue: { name: string, payload: any, onExecute?: () => void }[] = [];
    private config: EventServiceConfig;

    intervalId = undefined

    constructor(config?: EventServiceConfig) {

        this.config = config ?? {
            autoFire: true,
        };


    }

    /**
     * Register a new handler for the given event name
     */
    onEvent<T = any>(name: string, handler: (payload: T) => void) {
        if (!this.eventsMap.has(name)) {
            this.eventsMap.set(name, new Set());
        }
        this.eventsMap.get(name)!.add(handler);
    }

    /**
     * Trigger all handlers for a given event name manually
     */
    callEvent(name: string, payload: any, onExecute?: any) {
        if (!this.config.autoFire) {
            this.eventQueue.push({name, payload, onExecute});
            return
        }

        const handlers = this.eventsMap.get(name);
        if (handlers) {
            for (const handler of handlers) {
                handler(payload);
            }
        }
    }

    /**
     * Trigger all handlers for a given event name manually
     */
    async callEventSync(name: string, payload: any): Promise<void> {
        const handlers = this.eventsMap.get(name);
        if (handlers) {
            for (const handler of handlers) {
                await handler(payload);
            }
        }
    }


    async executeEvents() {

        let executeActions = []
        while (this.eventQueue.length > 0) {
            const {name, payload, onExecute} = this.eventQueue.shift()!;

            if (onExecute)
                executeActions.push(onExecute)

            const handlers = this.eventsMap.get(name);
            // console.log('executing events', name, this.eventsMap.keys().map(e => e))
            if (handlers) {
                for (const handler of handlers) {
                    handler(payload);
                }
            }
        }

        for (let action of executeActions) {
            //@ts-ignore
            action();
        }
    }

    clear() {
        this.eventsMap = new Map<string, Set<(payload: any) => void>>();
        this.eventQueue = [];
    }

}