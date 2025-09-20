import type {Optional} from "$lib/fluti/utils/optional";
import type {Supplier} from "../methods";
import type {BunSQLiteDatabase} from "drizzle-orm/bun-sqlite/driver";

export type IDbConnection = Supplier<Promise<BunSQLiteDatabase>>

export interface Where {
    field: string
    operator: '=' | '>=' | '<=' | ">" | "<"
    value: any,
    connector?: 'and' | 'or'
}

export interface QueryOptions {
    where?: Where[]
    limit?: number
    offset?: number
    sort?: Record<string, 'desc' | 'asc'>
}

export interface IRepository<T> {
    /**
     * Returns the name of the collection
     */
    name(): string;

    /**
     * Inserts a new item into the collection
     * @param item The item to insert
     * @returns An Optional containing the inserted item or a failure
     */
    insert(item: T): Promise<Optional<T>>;

    /**
     * Updates an existing item in the collection
     * @param item The item with updated values (must contain primary key)
     * @returns An Optional containing the updated item or a failure
     */
    update(item: Partial<T>): Promise<Optional<T>>;

    upsert(item: Partial<T>): Promise<Optional<T>>;

    /**
     * Deletes an item from the collection
     * @param item The item or primary key of the item to delete
     * @returns An Optional containing the deleted item or a failure
     */
    delete(item: string | T): Promise<Optional<T>>;

    /**
     * Finds items in the collection that match the provided predicate
     * @param lambda A function that returns true for matching items
     * @returns An Optional containing an array of matching items or a failure
     */
    find(lambda: (item: T) => boolean): Promise<Optional<T[]>>;

    /**
     * Retrieves all items from the collection
     * @returns An Optional containing an array of all items or a failure
     */

    findOneById(key: any): Promise<Optional<T>>;

    findOneByQuery(query: string): Promise<Optional<T>>;

    findOneByFields(fields: Record<string, any>): Promise<Optional<T>>

    findOneByField(field: string, value: any): Promise<Optional<T>>

    findMany(options?: QueryOptions): Promise<Optional<T[]>>;

    findManyByQuery(query: string, options?: QueryOptions): Promise<Optional<T[]>>

    findManyByField(field: string, value: any, options?: QueryOptions): Promise<Optional<T[]>>

    findManyByFields(fields: Record<string, any>, options?: QueryOptions): Promise<Optional<T[]>>;
}