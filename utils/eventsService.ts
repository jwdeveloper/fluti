export interface Cancelable<T> {
    isCanceled: boolean;
    data: T
}

export class EventsController {
    private eventsMap = new Map<string, Set<(payload: any) => void>>();
    private boundListeners = new Map<string, EventListener>();

    /**
     * Register a new handler for the given event name
     */
    onEvent(name: string, handler: (payload: any) => void) {
        if (!this.eventsMap.has(name)) {
            this.eventsMap.set(name, new Set());
        }
        this.eventsMap.get(name)!.add(handler);
    }

    /**
     * Trigger all handlers for a given event name manually
     */
    callEvent(name: string, payload: any) {
        const handlers = this.eventsMap.get(name);
        if (handlers) {
            for (const handler of handlers) {
                handler(payload);
            }
        }
    }

    clear() {
        this.eventsMap = new Map<string, Set<(payload: any) => void>>();
    }

    /**
     * Bind all registered events to the window as CustomEvents
     */
    // bind() {
    //     for (const [name, handlers] of this.eventsMap.entries()) {
    //         if (!this.boundListeners.has(name)) {
    //             const listener = (e: CustomEvent) => {
    //                 for (const handler of handlers) {
    //                     handler(e.detail);
    //                 }
    //             };
    //             window.addEventListener(name, listener as EventListener);
    //             this.boundListeners.set(name, listener as EventListener);
    //         }
    //     }
    // }
    //
    // /**
    //  * Unbind all CustomEvents from window
    //  */
    // unbind() {
    //     for (const [name, listener] of this.boundListeners.entries()) {
    //         window.removeEventListener(name, listener);
    //     }
    //     this.boundListeners.clear();
    // }
}