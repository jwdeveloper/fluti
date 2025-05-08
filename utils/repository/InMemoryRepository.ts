import type {Repository, RepositoryOptions} from "./Repository";

export class InMemoryRepository<T> implements Repository<T> {

    private readonly options: RepositoryOptions;
    private readonly items: T[];

    constructor(options: RepositoryOptions) {
        this.options = options;
        this.items = []
    }

    name(): string {
        return this.options.name ??"";
    }

    async findByIndex(indexName: string, indexValue: any): Promise<T[]> {
        throw new Error("Indexes are not supported in InMemory database!")
    }

    async delete(item: T | string): Promise<T | undefined> {
        let key = '';
        if (typeof item === 'string')
            key = item
        else
            //@ts-ignore
            key = item[this.options.key];

        //@ts-ignore
        const index = this.items.findIndex(existingItem => existingItem[this.options.key] === key);
        if (index !== -1) {
            let removed = this.items.splice(index, 1)[0];
            return removed;
        }
        return undefined;
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

    async insert(item: T): Promise<T | undefined> {
        //@ts-ignore
        if (this.items.some(existingItem => existingItem[this.options.key] === item[this.options.key])) {
            return undefined;
        }
        this.items.push(item);
        return item;
    }

    async update(item: T): Promise<T | undefined> {
        //@ts-ignore
        const index = this.items.findIndex(existingItem => existingItem[this.options.key] === item[this.options.key]);
        if (index !== -1) {
            this.items[index] = item;
            return item;
        }
        return undefined;
    }
}
