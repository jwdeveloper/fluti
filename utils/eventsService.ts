export interface Cancelable<T> {
    isCanceled: boolean;
    event: T
}

export interface EventServiceConfig {
    autoFire: boolean
}

export type AnyEventHandler = (name: string, payload: any) => void

export class EventsService {
    private eventsMap = new Map<string, Set<(payload: any) => void>>();
    private eventQueue: { name: string, payload: any, onExecute?: () => void }[] = [];

    private anyEventsHandlers: AnyEventHandler[] = []
    private config: EventServiceConfig;

    intervalId = undefined

    constructor(config?: EventServiceConfig) {

        this.config = config ?? {
            autoFire: true,
        };

    }

    onAnyEvent(handler: (name: string, payload: any) => void) {
        this.anyEventsHandlers.push(handler);
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
    callEvent<T = any>(name: string, payload: T, onExecute?: any) {

        if (name === undefined) {
            throw new Error(`called name with undefined name ${name}`)
        }

        if (!this.config.autoFire) {
            this.eventQueue.push({nexoLogin: name, payload, onExecute});
            return
        }
        this.callAnyHandlers(name, payload)
        const handlers = this.eventsMap.get(name);
        if (handlers) {
            for (const handler of handlers) {
                handler(payload);
            }
        }
    }

    async callEventWithParams(name: string, ...params: any[]) {
        const handlers = this.eventsMap.get(name);
        this.callAnyHandlers(name, params)

        if (handlers) {
            for (const handler of handlers) {
                //@ts-ignore
                await handler(...params);
            }
        }
    }


    /**
     * Trigger all handlers for a given event name manually
     */
    async callEventSync(name: string, payload: any): Promise<any> {
        const handlers = this.eventsMap.get(name);
        let response = [];
        this.callAnyHandlers(name, payload)
        if (handlers) {
            for (const handler of handlers) {
                response.push(await handler(payload))
            }
        }

        if (response.length === 0)
            return undefined;
        if (response.length === 1) {
            return response[0]
        }
        return response;
    }


    async executeEvents() {

        let executeActions = []
        while (this.eventQueue.length > 0) {
            const {name, payload, onExecute} = this.eventQueue.shift()!;

            if (!name) {
                // console.warn(name, payload)
                return
            }

            if (onExecute)
                executeActions.push(onExecute)

            this.callAnyHandlers(name, payload)

            const handlers = this.eventsMap.get(name);
            // console.log('executing events', name, this.eventsMap.keys().map(e => e))
            if (handlers) {
                for (const handler of handlers) {
                    handler(payload);
                }
            } else {
                console.warn('handlers not found for event ', name)
            }
        }

        for (let action of executeActions) {
            //@ts-ignore
            action();
        }
    }


    callAnyHandlers(name: string, payload: any) {
        for (let handler of this.anyEventsHandlers) {
            handler(name, payload);
        }
    }

    clear() {
        this.eventsMap = new Map<string, Set<(payload: any) => void>>();
        this.eventQueue = [];
        this.anyEventsHandlers = []
    }

}