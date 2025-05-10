import {browser} from "$app/environment";

export interface ShortcutAction {
    id?: string
    name: string,
    method: (event: KeyboardEvent, args: any) => void,
    shortcuts: string[],
    tags?: string[],
    icon?: string,
    displayedName?: string,
    path?: string,
    description?: string,
    preventDefault?: boolean
    undo?: any,
    trackable?: boolean

    //Plugin from where action is coming from
    plugin?: string

    //Svelte component assigned to this action
    component?: any
}

export class ShortcutsManager {
    private queue: string[] = [];
    private heldKeys = new Set<string>();
    private callback: (event: KeyboardEvent, action: ShortcutAction[]) => void = () => {
    };
    private actionsProvider: () => ShortcutAction[];
    private queueSize: number = 10;
    private lastKeyPressTime: number = Date.now();

    constructor(actionsProvider: () => ShortcutAction[]) {
        this.actionsProvider = actionsProvider;
    }

    private unbindAction: () => void = () => {
    }

    isKeyPressed(key: string) {
        return this.heldKeys.has(key);
    }

    bind() {

        if (!browser) {
            return
        }

        this.unbind();

        const keydownHandler = this.handleKeyPress.bind(this);
        const keyupHandler = this.handleKeyUp.bind(this);

        if (window) {
            window?.addEventListener('keydown', keydownHandler);
            // window?.addEventListener('keyup', keyupHandler);
        }


        this.unbindAction = () => {
            if (window) {
                window?.removeEventListener('keydown', keydownHandler);
                // window?.removeEventListener('keyup', keyupHandler);
            }

        }
        return this.unbindAction;
    }

    unbind() {
        if (this.unbindAction) {
            this.queue = []
            this.heldKeys = new Set<string>();
            this.unbindAction()
        }
    }

    onShortcutTriggered(callback: (event: KeyboardEvent, action: ShortcutAction[]) => void) {
        this.callback = callback;
    }


    validateShortcut(shortcut: string): boolean {
        const keys = shortcut.split(" ").map(k => k.toLowerCase());

        // console.log('validating ',shortcut)

        //check held keys
        if (this.heldKeys.size === keys.length) {
            let result = false;
            for (let i = 0; i < keys.length; i++) {
                const expected = keys[keys.length - 1 - i];
                result = this.heldKeys.has(expected);
                if (!result)
                    break;
            }
            if (result === true)
                return true;
        }


        if (this.queue.length < keys.length) {
            return false;
        }

        for (let i = 0; i < keys.length; i++) {
            const expected = keys[keys.length - 1 - i];
            const actual = this.queue[this.queue.length - 1 - i];
            if (expected !== actual) {
                return false;
            }
        }

        return true;
    }

    handleKeyUp(event: KeyboardEvent) {
        const key = event.key.toLowerCase() === 'meta' ? 'alt' : event.key.toLowerCase();


        const actions = this.actionsProvider();
        const result: ShortcutAction[] = [];

        for (const action of actions) {
            for (const shortcut of action.shortcuts) {
                if (this.validateShortcut(shortcut)) {
                    result.push(action);
                    break;
                }
            }
        }
        this.heldKeys.delete(key);
        if (result.length > 0) {
            this.queue = [];
            this.callback(event, result);
        }
    }

    handleKeyPress(event: KeyboardEvent) {

        const key = event.key.toLowerCase() === 'meta' ? 'alt' : event.key.toLowerCase();
        this.heldKeys.add(key);

        console.log(key, this.heldKeys, this.queue)

        const currentTime = Date.now();
        if (currentTime - this.lastKeyPressTime > 500) {
            this.queue = [];
        }

        this.queue.push(key);
        if (this.queue.length > this.queueSize) {
            this.queue.shift();
        }
        this.lastKeyPressTime = currentTime;


        this.handleKeyUp(event)
        // console.log('key down', event.key, this.queue, this.heldKeys);
    }
}

export function useShortcutsManager(
    actionsProvider: () => ShortcutAction[],
    onShortcutTriggered?: (event: KeyboardEvent, actions: ShortcutAction[]) => void
) {
    const manager = new ShortcutsManager(actionsProvider);

    manager.onShortcutTriggered(onShortcutTriggered || ((event, actions) => {
        for (const action of actions) {
            try {
                action.method(event, undefined);
            } catch (err) {
                console.error('Error executing shortcut', err);
            }
        }
    }));

    manager.bind();
    return manager;
}
