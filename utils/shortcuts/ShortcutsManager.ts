export interface ShortcutAction {
    name: string,
    method: any,
    shortcuts: string[],
    tags?: string[],
    icon?: string,
    displayedName?: string,
    path?: string,
    description?: string,
    preventDefault?: boolean
    undo?: any,
    trackable?: boolean
}

export class ShortcutsManager {
    private queue: string[] = [];
    private heldKeys = new Set<string>();
    private callback: (action: ShortcutAction[]) => void = () => {
    };
    private actionsProvider: () => ShortcutAction[];
    private queueSize: number = 2;
    private lastKeyPressTime: number = Date.now();

    constructor(actionsProvider: () => ShortcutAction[]) {
        this.actionsProvider = actionsProvider;
    }

    bind() {
        const keydownHandler = this.handleKeyPress.bind(this);
        const keyupHandler = this.handleKeyUp.bind(this);

        window.addEventListener('keydown', keydownHandler);
        window.addEventListener('keyup', keyupHandler);

        return () => {
            window.removeEventListener('keydown', keydownHandler);
            window.removeEventListener('keyup', keyupHandler);
        }
    }

    onShortcutTriggered(callback: (action: ShortcutAction[]) => void) {
        this.callback = callback;
    }

    validateShortcut(shortcut: string): boolean {
        const keys = shortcut.split(" ").map(k => k.toLowerCase());


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
        console.log('keyup', key);


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
            this.callback(result);
        }
    }

    handleKeyPress(event: KeyboardEvent) {

        const key = event.key.toLowerCase() === 'meta' ? 'alt' : event.key.toLowerCase();
        this.heldKeys.add(key);

        const currentTime = Date.now();
        if (currentTime - this.lastKeyPressTime > 500) {
            this.queue = [];
        }

        this.queue.push(key);
        if (this.queue.length > this.queueSize) {
            this.queue.shift();
        }
        this.lastKeyPressTime = currentTime;
        // console.log('key down', event.key, this.queue, this.heldKeys);
    }
}

export function useShortcutsManager(
    actionsProvider: () => ShortcutAction[],
    onShortcutTriggered?: (actions: ShortcutAction[]) => void
) {
    const manager = new ShortcutsManager(actionsProvider);

    manager.onShortcutTriggered(onShortcutTriggered || ((actions) => {
        for (const action of actions) {
            try {
                action.method();
            } catch (err) {
                console.error('Error executing shortcut', err);
            }
        }
    }));

    const unbind = manager.bind();
    return {manager, destroy: unbind};
}
