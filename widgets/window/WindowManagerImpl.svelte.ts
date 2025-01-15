import type {Component, Snippet} from "svelte";


export enum WindowCloseReason {
    none,
    save,
    cancel,
    offscreen,
    escape
}

export interface WindowAction {
    closeReason: WindowCloseReason,
    result: any
    error: any
    window: WindowHandle
}

export class WindowHandle {
    id: string
    component: Component
    isOpen: boolean = $state(false)
    input: any
    closeReason: WindowCloseReason
    output: any = $state({})
    allowCloseOutsite: boolean = true;
    onBeforeClose: (reason: WindowCloseReason) => boolean = (reason) => true;

    constructor(id: string, component: Component) {
        this.id = id;
        this.component = component
        this.closeReason = WindowCloseReason.none
    }


    async close(reason?: WindowCloseReason) {

        if (reason === WindowCloseReason.offscreen && !this.allowCloseOutsite) {
            return
        }

        if (!reason)
            this.closeReason = WindowCloseReason.offscreen
        else
            this.closeReason = reason;

        if (this.onBeforeClose) {
            let result = await this.onBeforeClose(this.closeReason)
            if (result === false)
                return;
        }
        this.isOpen = false;
    }

    async open(props?: any): Promise<WindowAction> {

        if (props !== undefined)
            this.input = props;

        this.isOpen = true;
        let window = this;
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                if (!this.isOpen) {
                    resolve({
                        window: window,
                        result: window.output,
                        closeReason: window.closeReason,
                        error: ''
                    })
                    clearInterval(interval)
                    return
                }
            }, 10)
        })
    }

}

export class WindowManager {
    handlers: WindowHandle[] = $state([]);

    create(component: Component): WindowHandle {
        const id = Math.random() * 1000 + "_window";
        const window = new WindowHandle(id, component);
        this.handlers.push(window)
        return window;
    }

    async open(component: Component, props?: any): Promise<WindowAction> {
        let handle = this.create(component)
        let result = await handle.open(props)
        this.destroy(handle)
        return result;
    }

    destroy(handle: WindowHandle) {
        const index = this.handlers.findIndex(selectedItem => selectedItem.id === handle.id);
        if (index !== -1)
            this.handlers.splice(index, 1);
    }
}


const instance = new WindowManager();

export let useWindowManager = () => {
    return instance;
}

export let useWindow = (component: Component<any> | Snippet | any) => {
    return instance.create(component);
}