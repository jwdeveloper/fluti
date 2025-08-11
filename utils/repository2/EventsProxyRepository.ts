import type {IRepository} from "$lib/core/server/repositories/IRepository";
import type {Optional} from "$lib/fluti/utils/optional";
import type {Consumer} from "$lib/fluti/utils/methods";

export type RepositoryEventCallback<T> = Consumer<ItemUpdateEvent<T>>

export interface ItemUpdateEvent<T> {
    type: 'insert' | 'update' | 'delete' | 'before.insert' | 'before.update' | 'before.delete'
    data: T
}

export class EventsProxyRepository<T> implements IRepository<T> {
    _repo: IRepository<T>
    private _events: any[] = []

    constructor(repository: IRepository<T>) {
        this._repo = repository;
    }

    findOneByField(field: string, value: any): Promise<Optional<T>> {
        return this._repo.findOneByField(field, value);
    }

    upsert(item: T): Promise<Optional<T>> {
        return this._repo.upsert(item);
    }

    findOneByQuery(query: string): Promise<Optional<T>> {
        return this._repo.findOneByQuery(query);
    }

    findOneByFields(fields: Record<string, any>): Promise<Optional<T>> {
        return this._repo.findOneByFields(fields);
    }

    findManyByFields(fields: Record<string, any>): Promise<Optional<T[]>> {
        return this._repo.findManyByFields(fields);
    }

    name(): string {
        return this._repo.name();
    }

    async insert(item: T): Promise<Optional<T>> {
        await this.callEvent(item, 'before.insert')
        let result = await this._repo.insert(item)
        if (result)
            await this.callEvent(result, 'insert')
        return result;
    }

    async update(item: Partial<T>): Promise<Optional<T>> {
        await this.callEvent(item, 'before.update')
        let result = await this._repo.update(item)
        if (result)
            await this.callEvent(result, 'update')
        return result;
    }

    async delete(item: string | T): Promise<Optional<T>> {
        await this.callEvent(item, 'before.delete')
        let result = await this._repo.delete(item)
        if (result)
            await this.callEvent(result, 'delete')
        return result;
    }

    find(lambda: (item: T) => boolean): Promise<Optional<T[]>> {
        return this._repo.find(lambda);
    }

    findMany(): Promise<Optional<T[]>> {
        return this._repo.findMany();
    }

    findOneById(key: any): Promise<Optional<T>> {
        return this._repo.findOneById(key);
    }

    findManyByQuery(query: string): Promise<Optional<T[]>> {
        return this._repo.findManyByQuery(query);
    }

    findManyByField(indexName: string, indexValue: any): Promise<Optional<T[]>> {
        return this._repo.findManyByField(indexName, indexValue);
    }

    onEvent(update: RepositoryEventCallback<T>) {
        this._events.push(update);
    }

    private async callEvent(data: any, type: string) {
        for (let event of this._events) {
            event({
                type: type,
                data: data
            })
        }
    }
}