type CacheItem = {
    value: any;
    expiresAt?: number; // timestamp in milliseconds
};

export class CacheService {
    private cache = new Map<string, CacheItem>();

    set(key: string, value: any, durationSeconds?: number) {
        const expiresAt = durationSeconds
            ? Date.now() + durationSeconds * 1000
            : undefined;

        this.cache.set(key, { value, expiresAt });
    }

    get(key: string): any | undefined {
        const item = this.cache.get(key);
        if (!item) return undefined;

        if (item.expiresAt && item.expiresAt < Date.now()) {
            this.cache.delete(key);
            return undefined;
        }

        return item.value;
    }

    has(key: string): boolean {
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