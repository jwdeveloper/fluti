export class CacheService {
    private cache = new Map<string, any>();

    set(key: string, value: any) {
        this.cache.set(key, value);
    }

    get(key: string): any | undefined {
        return this.cache.get(key);
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    size():number{
        return this.cache.size;
    }
}
