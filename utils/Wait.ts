import {tick} from "svelte";

type CancelCallback = () => void;

export class CancellationToken {
    private _isCancelled = false;
    private _callbacks: CancelCallback[] = [];

    get isCancelled(): boolean {
        return this._isCancelled;
    }

    /** Used internally to cancel the token. */
    cancel() {
        if (this._isCancelled) return;

        this._isCancelled = true;
        for (const cb of this._callbacks) {
            cb();
        }
        this._callbacks = [];
    }

    /** Subscribe a callback to be called on cancellation. */
    onCancel(callback: CancelCallback): void {
        if (this._isCancelled) {
            callback();
        } else {
            this._callbacks.push(callback);
        }
    }

    /** Returns a promise that resolves when the token is cancelled. */
    asPromise(): Promise<void> {
        return this._isCancelled
            ? Promise.resolve()
            : new Promise<void>((resolve) => this.onCancel(resolve));
    }
}

export class CancellationTokenSource {
    private _tokens: CancellationToken[] = [];

    /** Always returns a new token and stores it in the list. */
    get token(): CancellationToken {
        const token = new CancellationToken();
        this._tokens.push(token);
        return token;
    }

    /** Cancels all tokens created so far. */
    cancel(): void {
        for (const token of this._tokens) {
            token.cancel();
        }
    }

    /** Returns all created tokens. */
    get allTokens(): readonly CancellationToken[] {
        return this._tokens;
    }
}

export async function waitTick(callback: () => void, ticks?: number) {
    if (ticks === undefined)
        ticks = 1;

    for (let i = 0; i < ticks; i++) {
        await tick();
    }
    callback();
}


export async function wait(milliseconds: any, token?: CancellationToken): Promise<void> {
    if (typeof milliseconds === "number") {
        if (token?.isCancelled) {
            return
        }
        return new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(resolve, milliseconds);

            token?.onCancel(() => {
                clearTimeout(timeout);
                resolve();
            });
        });
    }
    // If not a number, assume it's a list of waits (like Promise[])
    return all(milliseconds);
}

export async function waitUntil(supplier: () => boolean | Promise<boolean>, intervalMs: number = 100, token?: CancellationToken) {
    while (true) {
        if (token?.isCancelled)
            return

        const result = await supplier();

        if (typeof result !== 'boolean') {
            throw new Error("Supplier must return a boolean.");
        }

        if (result) {
            return;
        }

        await wait(intervalMs, token);
    }
}

export async function all(fn: any, time?: any, delay?: any) {

    if (delay !== undefined) {
        await wait(delay)
    }
    if (time === undefined)
        time = 600;

    await fn();
    await wait(time)
}

export function getCurrentTime() {
    return new Date().toISOString();
}

export function generatePassword(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
}

export function generateUUID() { // Public Domain/MIT
    let d = new Date().getTime();//Timestamp
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function vibrate() {
    if (navigator && navigator?.vibrate)
        navigator?.vibrate(25);

}