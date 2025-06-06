import {type DatabaseSchema} from "./Schema";
import {CacheService} from "$lib/fluti/services/CacheService";


let connections = new CacheService<string, IDBDatabase>()

export async function useDatabase(databaseSchema: DatabaseSchema): Promise<IDBDatabase> {

    if (connections.has(databaseSchema.name)) {
        //@ts-ignore
        return connections.get(databaseSchema.name);
    }

    return new Promise((resolve, reject) => {
        if (!window.indexedDB) {
            reject("Your browser doesn't support IndexedDB.");
            return;
        }
        databaseSchema.tables = databaseSchema.tables ?? []

        const request = indexedDB.open(databaseSchema.name, databaseSchema.version);

        request.onupgradeneeded = (event) => {
            //@ts-ignore
            const db = event.target.result as IDBDatabase;
            for (let storeSchema of databaseSchema.tables) {

                let store: IDBObjectStore;
                if (!db.objectStoreNames.contains(storeSchema.name)) {
                    store = db.createObjectStore(storeSchema.name, {keyPath: storeSchema.key});
                } else {
                    let storeObject = request.transaction?.objectStore(storeSchema.name);
                    if (!storeObject) {
                        console.log('Store not found', storeSchema.name);
                        continue;
                    }
                    store = storeObject
                }
                for (let index of storeSchema.indexes ?? []) {
                    if (!store.indexNames.contains(index))
                        store.createIndex(index, index);
                }
            }
        };

        request.onsuccess = (event) => {
            //@ts-ignore
            const db: IDBDatabase = event.target.result;
            connections.set(db.name, db, 1000 * 60 * 10);
            resolve(db);
        };

        request.onerror = (event) => {
            console.log('Database error:', event);
            //@ts-ignore
            reject("Database error: " + event.target.errorCode);
        };
    });
}

