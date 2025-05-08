
export interface EventsController {
    onEvent(name: string , event: (payload: any) => void): any,

    callEvent(name: string, payload: any): void,

    clear(): void,
}

let eventsMap = new Map<string, EventListener>();

export let eventsContext: EventsController = {
// @ts-ignore

    // Register event listener and track the event name
    onEvent: function (name: string | OpenVideoEvent, event: (payload: any) => void) {

        const eventListener = (e: CustomEvent) => {
            event(e.detail);  // Pass the custom event's detail (payload) to the handler
        };
        //
        // if (!name.includes("_")) {
        //     Object.values(OpenVideoEvent)
        //         .filter(e => {
        //             return e.startsWith(name) && e !== name
        //         })
        //         .forEach(e => {
        //             this.onEvent(e, event);
        //         })
        // }

        // @ts-ignore
        window.addEventListener(name, eventListener);
        // @ts-ignore
        eventsMap.set(name, eventListener);

        return () => {
            // @ts-ignore
            window.removeEventListener(name, eventListener);
        }
    },

    // Trigger the custom event
    callEvent: function (name: string, payload: any) {
        const customEvent = new CustomEvent(name, {
            detail: payload,  // Pass the payload as event's detail
        });
        window.dispatchEvent(customEvent);  // Dispatch the event on the window
    },

    clear: function () {


        // @ts-ignore
        eventsMap.forEach((listener, eventName) => {
            window.removeEventListener(eventName, listener);
        });

        eventsMap.clear();
    }
};

export let onEvent = (eventName: string, action: any) => {
    return eventsContext.onEvent(eventName, action)
}