import type {Repository, RepositoryOptions} from "./Repository";
import {generateUUID} from "$lib/fluti/utils/Wait";

export class InMemoryRepository<T> implements Repository<T> {

    private readonly options: RepositoryOptions;
    items: T[] = $state([]);
    private readonly indexes: Map<string, Map<any, T[]>>;

    constructor(options: RepositoryOptions) {
        this.options = options;
        this.indexes = new Map();

        // Initialize index maps
        if (this.options.indexes) {
            for (const index of this.options.indexes) {
                this.indexes.set(index, new Map());
            }
        }
    }

    name(): string {
        return this.options.name ?? "";
    }

    async findByIndex(indexName: string, indexValue: any): Promise<T[]> {
        const indexMap = this.indexes.get(indexName);
        if (!indexMap) {
            throw new Error(`Index '${indexName}' is not supported in repository ${this.name()}`);
        }
        return indexMap.get(indexValue) ?? [];
    }

    async findByKey(key: any): Promise<T | undefined> {
        //@ts-ignore
        return this.items.find(item => item[this.options.key] === key);
    }

    async find(lambda: (item: T) => boolean): Promise<T[]> {
        return this.items.filter(lambda);
    }

    async findAll(): Promise<T[]> {
        return [...this.items];
    }

    async delete(item: T | string): Promise<T | undefined> {
        let key: string;
        if (typeof item === 'string') {
            key = item;
        } else {
            // @ts-ignore
            key = item[this.options.key];
        }

        // @ts-ignore
        const index = this.items.findIndex(existingItem => existingItem[this.options.key] === key);
        if (index !== -1) {
            const removed = this.items.splice(index, 1)[0];
            this.removeFromIndexes(removed);
            return removed;
        }
        return undefined;
    }

    async deleteAll() {
        for (let item of this.items) {
            this.delete(item)
        }
    }

    async insert(item: T): Promise<T | undefined> {

        //@ts-ignore
        if (item[this.options.key] === undefined)
            //@ts-ignore
            item[this.options.key] = generateUUID();

        // @ts-ignore
        if (this.items.some(existingItem => existingItem[this.options.key] === item[this.options.key])) {
            return undefined;
        }

        this.items.push(item);
        this.addToIndexes(item);
        return item;
    }

    async update(item: T): Promise<T | undefined> {
        // @ts-ignore
        const key = item[this.options.key];
        //@ts-ignore
        const index = this.items.findIndex(existingItem => existingItem[this.options.key] === key);

        if (index !== -1) {
            const oldItem = this.items[index];
            this.removeFromIndexes(oldItem);
            this.items[index] = item;
            this.addToIndexes(item);
            return item;
        }
        return undefined;
    }

    private addToIndexes(item: T) {
        for (const [field, map] of this.indexes.entries()) {
            // @ts-ignore
            const value = item[field];
            if (!map.has(value)) {
                map.set(value, []);
            }
            map.get(value)?.push(item);
        }
    }

    private removeFromIndexes(item: T) {
        for (const [field, map] of this.indexes.entries()) {
            // @ts-ignore
            const value = item[field];
            const arr = map.get(value);
            if (arr) {
                const index = arr.indexOf(item);
                if (index !== -1) arr.splice(index, 1);
                if (arr.length === 0) map.delete(value);
            }
        }
    }
}
