import type {Repository} from "./Repository";
import type {Consumer} from "$lib/fluti/utils/methods";


export type RepositoryEventCallback<T> = Consumer<ItemUpdateEvent<T>>

export interface ItemUpdateEvent<T> {
    type: 'insert' | 'update' | 'delete' | 'before.insert' | 'before.update' | 'before.delete'
    data: T
}

export class ReactiveRepository<T> implements Repository<T> {
    private readonly _repo: Repository<T>
    trigger: number = $state(0)
    private _events: any[] = $state([])

    // private readonly _events: EventsController

    constructor(repository: Repository<T>) {
        this._repo = repository;
        // this._events = eventsContext;
    }

    onEvent(update: RepositoryEventCallback<T>) {
        this._events.push(update);
    }

    async findByIndex(indexName: string, indexValue: any): Promise<T[]> {
        return await this._repo.findByIndex(indexName, indexValue);
    }

    name(): string {
        return this._repo.name();
    }

    async insert(item: T): Promise<T | undefined> {
        await this.callEvent(item, 'before.insert')
        let result = await this._repo.insert(item)
        if (result)
            await this.callEvent(result, 'insert')
        return result;
    }

    async update(item: Partial<T>): Promise<T | undefined> {
        await this.callEvent(item, 'before.update')
        let result = await this._repo.update(item)
        if (result)
            await this.callEvent(result, 'update')
        return result;
    }

    async delete(item: T | string): Promise<T | undefined> {
        await this.callEvent(item, 'before.delete')
        let result = await this._repo.delete(item)
        if (result)
            await this.callEvent(result, 'delete')
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

    private async callEvent(data: any, type: string) {
        // console.log('call event', data,this.trigger)
        this.trigger++;
        for (let event of this._events) {
            event({
                type: type,
                data: data
            })
        }
        // this._events.callEvent(this._repo.name(), data)
    }

    async findByQuery(query: string) {
        return await this._repo.findByQuery(query)
    }
}
