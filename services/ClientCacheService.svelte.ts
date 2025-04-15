import {CacheService} from "$lib/fluti/services/CacheService";


export class ClientCacheService<K = string, V = any> extends CacheService<K, V> {

    saveStorageKey: string = 'save-storage'
    cache = $state(new Map<K, V>());
    _updater = $state(0);

    set(key: K, value: V, durationSeconds?: number) {
        console.log('set!')
        this._updater++;
        super.set(key, value, durationSeconds);
    }

    saveClient(storageKey?: string) {

        const obj: Record<string, { value: V; expiresAt?: number }> = {};
        for (const [key, item] of this.cache) {
            //@ts-ignore
            obj[key] = item;
        }

        if (storageKey === undefined)
            storageKey = this.saveStorageKey;

        localStorage.setItem(storageKey, JSON.stringify(obj));
        this._updater++;

    }

    loadClient(storageKey?: string) {
        if (storageKey === undefined)
            storageKey = this.saveStorageKey;

        const raw = localStorage.getItem(storageKey);
        if (!raw) return;

        try {
            this._updater++;
            const obj = JSON.parse(raw) as Record<string, { value: V; expiresAt?: number }>;
            for (const [key, item] of Object.entries(obj)) {
                if (!item.expiresAt || item.expiresAt > Date.now()) {
                    //@ts-ignore
                    this.cache.set(key as K, item);
                }
            }

        } catch (err) {
            console.error("Failed to parse cache from localStorage", err);
        }
    }
}