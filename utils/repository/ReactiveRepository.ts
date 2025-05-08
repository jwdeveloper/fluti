import type {Repository} from "./Repository";

export class ReactiveRepository<T> implements Repository<T> {
    private readonly _repo: Repository<T>
    // private readonly _events: EventsController

    constructor(repository: Repository<T>) {
        this._repo = repository;
        // this._events = eventsContext;
    }

    async findByIndex(indexName: string, indexValue: any): Promise<T[]> {
        return await this._repo.findByIndex(indexName, indexValue);
    }

    name(): string {
        return this._repo.name();
    }

    async insert(item: T): Promise<T | undefined> {
        let result = await this._repo.insert(item)
        if (result)
            this._events.callEvent(this._repo.name(), result)
        return result;
    }

    async update(item: T): Promise<T | undefined> {
        let result = await this._repo.update(item)
        if (result)
            this._events.callEvent(this._repo.name(), result)
        return result;
    }

    async delete(item: T | string): Promise<T | undefined> {
        let result = await this._repo.delete(item)
        if (result)
            this._events.callEvent(this._repo.name(), result)
        return result;
    }

    async findAll(): Promise<T[]> {
        return await this._repo.findAll()
    }

    async findByKey(key: any): Promise<T | undefined> {
        return await this._repo.findByKey(key)
    }


    async find(lambda: (item: T) => boolean): Promise<T[]> {
        return await this._repo.find(lambda)
    }
}
