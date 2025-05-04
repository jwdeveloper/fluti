import {canvasController} from "../../../../routes/canva/canvasController.svelte";

export interface ShortcutAction {
    name: string,
    method: any,
    shortcuts: string[],
    icon?: string,
    displayedName?: string,
    path?: string,
    description?: string,
    undo?: any,
    trackable?: boolean
}

export class ShortcutsManager {
    private queue: any[];
    private callback: (action: ShortcutAction[]) => void
    private actionsProvider: () => ShortcutAction[]
    private queueSize: number;
    private lastKeyPressTime: number;

    constructor(actionsProvider: () => ShortcutAction[]) {
        this.queueSize = 5;
        this.actionsProvider = actionsProvider;
        this.callback = () => {
        }
        this.queue = []
        this.lastKeyPressTime = Date.now();
    }

    bind() {
        let a = this.handleKeyPress.bind(this);
        let b = this.handleExecute.bind(this);
        window.addEventListener('keydown', a)
        //@ts-ignore
        window.addEventListener('keyup', b)
        return () => {
            window.removeEventListener('keydown', a)
            //@ts-ignore
            window.removeEventListener('keyup', b)
        }
    }

    onShortcutTriggered(callback: (action: ShortcutAction[]) => void) {
        this.callback = callback;
    }

    validateShortcut(shortcut: string): boolean {
        let symbols = shortcut.split(" ")
        if (this.queue.length < symbols.length)
            return false;

        for (let i = 0; i < symbols.length; i++) {
            let symbol = symbols[symbols.length - 1 - i].toLowerCase();
            let pressed = this.queue[this.queue.length - 1 - i].toLowerCase();
            if (symbol !== pressed) {
                return false;
            }

        }
        return true;
    }

    handleExecute(event: KeyboardEvent) {

        // console.log(this.queue)
        let actions = this.actionsProvider()
        let result: ShortcutAction[] = []
        for (let action of actions) {
            let valid = false;
            for (let shortcut of action.shortcuts) {
                if (!this.validateShortcut(shortcut)) {
                    continue
                }
                valid = true;
            }
            if (valid)
                result.push(action)
        }
        if (result.length == 0)
            return
        this.queue = []
        this.callback(result)
    }

    handleKeyPress(event: KeyboardEvent) {


        let key = event.key;
        if (key === 'Meta')
            key = 'alt';
        console.log(key)

        const currentTime = Date.now();
        if (currentTime - this.lastKeyPressTime > 500) {
            this.queue = [];
            this.queue.push(key)
            this.lastKeyPressTime = Date.now();
            return;
        }

        this.lastKeyPressTime = Date.now();
        this.queue.push(key)
        if (this.queue.length > this.queueSize) {
            this.queue.shift()
        }
    }
}


export function useShortcutsManager(actionsProvider: () => ShortcutAction[], onShortcutTriggered?: (actions: ShortcutAction[]) => void) {

    if (!onShortcutTriggered) {
        onShortcutTriggered = (actions) => {
            console.log('siema?')
            for (let action of actions)
                action.method();
        }
    }

    let shortcuts = new ShortcutsManager(actionsProvider);
    shortcuts.onShortcutTriggered(onShortcutTriggered)
    let unbindShortcuts = shortcuts.bind();
    return {manager: shortcuts, destory: unbindShortcuts}
}