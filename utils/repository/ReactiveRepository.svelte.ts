import type {Repository} from "./Repository";

export class ReactiveRepository<T> implements Repository<T> {
    private readonly _repo: Repository<T>
    trigger: number = $state(0)
    private _events: any[] = $state([])

    // private readonly _events: EventsController

    constructor(repository: Repository<T>) {
        this._repo = repository;
        // this._events = eventsContext;
    }

    onEvent(update: () => {}) {
        this._events.push(update);
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
            this.callEvent(result)
        return result;
    }

    async update(item: T): Promise<T | undefined> {
        let result = await this._repo.update(item)
        if (result)
            this.callEvent(result)
        return result;
    }

    async delete(item: T | string): Promise<T | undefined> {
        let result = await this._repo.delete(item)
        if (result)
            this.callEvent(result)
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

    private callEvent(data: any) {
        // console.log('call event', data,this.trigger)
        this.trigger++;
        for(let event of this._events) {
            event(data)
        }
        // this._events.callEvent(this._repo.name(), data)
    }
}
