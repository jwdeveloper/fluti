type CacheItem = {
    value: any;
    expiresAt?: number; // timestamp in milliseconds
};

export class CacheService<K = string, V = any> {
    protected cache = new Map<K, V>();

    set(key: K, value: V, durationSeconds?: number) {
        const expiresAt = durationSeconds
            ? Date.now() + durationSeconds * 1000
            : undefined;
        //@ts-ignore
        this.cache.set(key, {value, expiresAt});
    }

    setIfEmpty(key: K, value: V): V {
        if (!this.has(key))
            this.set(key, value);
        //@ts-ignore
        return this.get(key);
    }

    get(key: K): V | undefined {
        const item = this.cache.get(key);
        if (!item) return undefined;

        //@ts-ignore
        if (item.expiresAt && item.expiresAt < Date.now()) {
            this.cache.delete(key);
            return undefined;
        }

        //@ts-ignore
        return item.value;
    }

    has(key: K): boolean {
        const item = this.cache.get(key);
        if (!item) return false;

        //@ts-ignore
        if (item.expiresAt && item.expiresAt < Date.now()) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    size(): number {
        this.cleanupExpired();
        return this.cache.size;
    }

    delete(key: K) {
        return this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }

    getOrSet(key: string, value: any, durationSeconds?: number): any {
        //@ts-ignore
        if (this.has(key)) {
        //@ts-ignore
            return this.get(key);
        }

        //@ts-ignore
        this.set(key, value, durationSeconds);
        return value;
    }

    items() {
        this.cleanupExpired();
        return this.cache.entries();
    }

    private cleanupExpired() {
        const now = Date.now();
        for (const [key, item] of this.cache) {
            //@ts-ignore
            if (item.expiresAt && item.expiresAt < now) {
                this.cache.delete(key);
            }
        }
    }

    /**
     *
     * @param options
     * - duration in sections
     * - when key is empty then method content became key
     */
    cachedMethod<TArgs extends any[], TResult>(options: {
        duration: number;
        method: (...args: TArgs) => Promise<TResult>;
        key?: string
    }): (...args: TArgs) => Promise<TResult> {
        const {duration, method, key} = options;
        let cacheKey: string = key ?? method + "";
        return async (...args: TArgs) => {
            //@ts-ignore
            const cached = this.get(cacheKey);
            if (cached)
                return cached as TResult;

            const data = await method(...args);
            //@ts-ignore
            this.set(cacheKey, data, duration);
            return data;
        };
    }
}
