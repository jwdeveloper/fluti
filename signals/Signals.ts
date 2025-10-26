import {describe, it} from "vitest";

interface State<T> {
    value: T
}

interface Derive<T> {
    value: T
}

interface StateOptions<T> {
    getter: (value: T) => void
    setter: (newValue: T, current: T) => T
    tag?: string

    //compares if value has been updated
    compare: (newValue: T, previousValue: T) => boolean
}

interface DeriveOptions<T> {
    dependecies?: State<any>[]
    cache?: boolean
}

interface Effect {
    id: string
    fun: Function
}

export type EffectFactory = (init: any, storage: SignalStorage, options?: StateOptions<any>) => State<any>

export interface SignalStorage {
    states: State<any>[]
    effects: Map<string, Effect>,
    _currentEffect?: Effect
    isEffectExecuting: boolean,
    shouldUpdate: boolean
    callBuffer: Set<string>


    state: <T>(init: T, options?: StateOptions<T>) => State<T>
    deriveBy: <T>(fun: () => T, options?: DeriveOptions<T>) => Derive<T>
    effect: (fn: Function) => void

    init: () => any
    tick: () => any
}

let createHash = (() => {
    let counter = 0;
    return () => `effect_${counter++}`;
})();

let createState: EffectFactory = (initialValue: any, storage: SignalStorage, options?: StateOptions<any>) => {
    let _value = initialValue;
    const dependencies = new Set<Effect>();

    let notify = () => {
        storage.shouldUpdate = true;
        isDirty = true;
        dependencies.forEach(e => {
            storage.callBuffer.add(e.id);
        })
    }
    let isDirty = true;

    let isDerivedBy = typeof initialValue === "function"
    let isArray = Array.isArray(_value);
    if (isArray) {
        _value = new Proxy(_value, {
            get(target, prop, receiver) {
                const val = Reflect.get(target, prop, receiver);
                if (typeof val === "function") {
                    return (...args: any[]) => {
                        const result = val.apply(target, args);
                        notify();
                        return result;
                    };
                }
                return val;
            }
        });
    }

    return {
        stateData: {
            dependencies: dependencies,
            isArray,
            isDerivedBy,
        },
        meta: {
            tag: options?.tag ?? "Unknown state",
            isDirty: () => isDirty
        },
        set value(value) {
            if (isDerivedBy)
                throw new Error("Only states can be set")

            let isDifferent = false;
            if (options?.compare)
                isDifferent = options.compare(_value, value)
            else
                isDifferent = _value !== value;

            if (options?.setter) {
                _value = options?.setter(value, _value)
            } else {
                _value = value;
            }

            if (isDifferent)
                notify();
        },
        get value() {
            if (storage._currentEffect) {
                dependencies.add(storage._currentEffect);
            }

            let value = _value
            if (isDerivedBy)
                value = initialValue();

            if (options?.getter)
                options.getter(value)

            return value;
        }
    }
}


let rect: SignalStorage = {
    states: [],
    effects: new Map(),
    callBuffer: new Set(),
    _currentEffect: undefined,
    isEffectExecuting: false,
    shouldUpdate: false,

    deriveBy<T>(fn: () => T, options?: DeriveOptions<T>) {
        const {dependecies = [], cache = true} = options || {};

        let cached: T | undefined;
        let dirty = true;

        // Create derived state (lazy)
        const derived = this.state(undefined);

        // Create effect that listens to dependency updates
        this.effect(() => {
            for (const dep of dependecies) {
                dep.value;
            }

            const newValue = fn();
            if (!cache || newValue !== cached) {
                cached = newValue;
                derived.value = newValue;
            }
            dirty = false;
        });

        Object.defineProperty(derived, "deriveData", {
            get() {
                return {
                    isDirty: dirty
                };
            }
        });
        Object.defineProperty(derived, "value", {
            get() {
                if (!cache) return fn();
                if (dirty) {
                    cached = fn();
                    dirty = false;
                }
                return cached;
            }
        });

        for (const dep of dependecies) {
            this.effect(() => {
                dep.value;
                dirty = true;
            });
        }

        return derived;
    },
    state(value: any, options?: StateOptions<any>) {
        let state = createState(value, this, options)
        this.states.push(state);
        return state
    },
    effect(fun: Function) {

        if (this.isEffectExecuting)
            throw new Error("Effect can not be added inside other effect!")

        let id = createHash();
        // let id = fun + ""
        let self = this;

        if (this.effects.get(id))
            return this.effects.get(id) as Effect

        this.effects.set(id, {
            id: id,
            fun: (...params: any) => {
                if (self.isEffectExecuting)
                    throw new Error("Effect can not be used inside effect!")
                self.isEffectExecuting = true;
                let result = fun(...params)
                self.isEffectExecuting = false;
                return result;
            }
        })
    },

    tick() {
        if (!this.shouldUpdate)
            return
        const effectsToRun = Array.from(this.callBuffer);
        this.callBuffer.clear();

        for (let effectId of effectsToRun) {
            this.effects.get(effectId)?.fun();
        }
        this.shouldUpdate = this.callBuffer.size > 0;
    },

    init() {
        this.callBuffer.clear();
        let destructors = []
        for (let effect of this.effects.values()) {
            this._currentEffect = effect
            destructors.push(this._currentEffect.fun())
            this._currentEffect = undefined
        }
        return () => {
            for (let d of destructors) {
                if (d === undefined)
                    continue
                d();
            }
        }
    }
}

describe('test', () => {
    it('a', () => {

        const name = rect.state(5, {
            tag: "Name"
        });
        const lastName = rect.state(5, {
            tag: "Last name"
        })
        const users = rect.state(['marco', 'adam', 'xom'], {
            tag: "List"
        })
        const wholeData = rect.deriveBy(() => {
            return users.value.map(e => {
                return {
                    name: e,
                    age: name.value,
                    lastName: lastName.value
                }
            })
        }, {
            dependecies: [name, lastName, users],
            cache: true
        })

        let a = rect.state(1);
        let b = rect.deriveBy(() => a.value + 1);
        let c = rect.deriveBy(() => {
            b.value += 1;
            return b.value + 1
        }, {
            cache: true
        });
        rect.effect(() => {
            name.value += 1;
        });
        rect.init();
        rect.tick();
    })
})