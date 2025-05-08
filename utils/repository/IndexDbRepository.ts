import type {Repository, RepositoryOptions} from "./Repository";
import {useDatabase} from "$lib/fluti/utils/repository/database/DatabaseInitialize";
import type {DatabaseSchema} from "$lib/fluti/utils/repository/database/Schema";


export class IndexedDBRepository<T> implements Repository<T> {
    private options: RepositoryOptions
    private databaseSchema: DatabaseSchema

    constructor(databaseSchema: DatabaseSchema, options: RepositoryOptions) {
        this.databaseSchema = databaseSchema;
        this.options = options;
    }

    name(): string {
        return this.options.name ?? '';
    }

    private async openDB(): Promise<IDBDatabase> {
        let connection = await useDatabase(this.databaseSchema)
        return connection;
    }

    async insert(item: T): Promise<T | undefined> {
        const db = await this.openDB();
        //@ts-ignore
        let key = item[this.options.key];
        const exists = await this.findByKey(key)
        if (exists) {
            return await this.update(item);
        }

        return new Promise((resolve, reject) => {
            // console.log(this.options.name,'name',this.databaseSchema)
            const transaction = db.transaction(this.options.name, 'readwrite');
            const store = transaction.objectStore(this.options.name);
            const request = store.add(item);
            request.onsuccess = () => {
                resolve(item);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async update(item: T): Promise<T | undefined> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.options.name, 'readwrite');
            const store = transaction.objectStore(this.options.name);
            const request = store.put(item);

            request.onsuccess = () => {
                resolve(item);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async delete(item: T): Promise<T | undefined> {
        const db = await this.openDB();

        let key = '';
        if (typeof item === 'string')
            key = item
        else
            //@ts-ignore
            key = item[this.options.key];
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.options.name, 'readwrite');
            const store = transaction.objectStore(this.options.name);
            const request = store.delete(key);

            request.onsuccess = () => resolve(item);
            request.onerror = () => reject(request.error);
        });
    }

    async find(lambda: (item: T) => boolean): Promise<T[]> {
        const items = await this.findAll();
        return items.filter(lambda);
    }

    async findByIndex(indexName: string, indexValue: any): Promise<T[]> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            if (!db.objectStoreNames.contains(this.options.name)) {
                resolve([]);
                return
            }

            const transaction = db.transaction(this.options.name, 'readonly');
            const store = transaction.objectStore(this.options.name);
            const index = store.index(indexName)
            const request = index.get(indexValue);

            request.onsuccess = () => {
                resolve(request.result as T[]);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    }


    async findAll(): Promise<T[]> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            if (!db.objectStoreNames.contains(this.options.name)) {
                resolve([]);
                return
            }

            const transaction = db.transaction(this.options.name, 'readonly');
            const store = transaction.objectStore(this.options.name);
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result as T[]);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async findByKey(key: any): Promise<T | undefined> {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            //@ts-ignore
            const transaction = db.transaction(this.options.name, 'readonly');
            //@ts-ignore
            const store = transaction.objectStore(this.options.name);
            const request = store.get(key);
            request.onsuccess = () => {
                resolve(request.result as T);
            };
            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}
