export interface IStorageMapper {
    /**
     * Saves an object to localStorage under the specified key.
     * @param key The key under which the object will be stored.
     * @param object The object to store.
     * @param defaultValue An optional default value to use if the object is undefined or null.
     */
    save(key: string, object: any, defaultValue?: any): void

    /**
     * Loads an object from localStorage by the specified key.
     * @param key The key of the object to retrieve.
     * @param defaultValue An optional default value to return if the key does not exist.
     * @returns The retrieved object or the default value if the key does not exist.
     */
    load(key: string, defaultValue?: any): void
}

export interface IStorageRepository {

    saveToStorage(mapper: StorageRepository): boolean | void

    loadFromStorage(mapper: StorageRepository): boolean | void
}

export class StorageRepository implements IStorageMapper {


    save(key: string, object: any, defaultValue?: any): void {
        try {
            const valueToStore = object !== undefined && object !== null ? object : defaultValue;
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error saving data to localStorage with key "${key}":`, error);
        }
    }

    load(key: string, defaultValue?: any): any {
        try {
            const storedValue = localStorage.getItem(key);
            if (storedValue === null) {
                return defaultValue;
            }
            return JSON.parse(storedValue);
        } catch (error) {
            console.error(`Error loading data from localStorage with key "${key}":`, error);
            return defaultValue;
        }
    }
}

const mapper = new StorageRepository();

export function handleSaveToLocalStorage(target: object): boolean {
    if (isStorageSave(target)) {
        target.saveToStorage(mapper);
    }
    for (const key of Object.keys(target)) {
        const value = (target as any)[key];
        if (typeof value === 'object' && value !== null) {
            handleSaveToLocalStorage(value);
        }
    }
    return true;
}

export function handleLoadFromLocalStorage(target: object): boolean {

    if (isStorageSave(target)) {
        target.loadFromStorage(mapper);
    }
    console.log('checking ', Object.keys(target), Object.getOwnPropertyNames(target))
    for (const key of Object.keys(target)) {
        console.log('checking ', key)
        const value = (target as any)[key];
        if (typeof value === 'object' && value !== null) {
            console.log('checking ', key)
            handleLoadFromLocalStorage(value);
        }
    }
    return true;
}


function isStorageSave(obj: any): obj is IStorageRepository {
    return typeof obj.saveToStorage === 'function' &&
        typeof obj.loadFromStorage === 'function';
}