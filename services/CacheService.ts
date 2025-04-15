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

        if (item.expiresAt && item.expiresAt < Date.now()) {
            this.cache.delete(key);
            return undefined;
        }

        return item.value;
    }

    has(key: K): boolean {
        const item = this.cache.get(key);
        if (!item) return false;

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

    getOrSet(key: string, value: any, durationSeconds?: number): any {
        if (this.has(key)) {
            return this.get(key);
        }

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
            if (item.expiresAt && item.expiresAt < now) {
                this.cache.delete(key);
            }
        }
    }

}