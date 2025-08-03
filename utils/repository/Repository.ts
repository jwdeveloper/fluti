import {InMemoryRepository} from "./InMemoryRepository.svelte";
import {IndexedDBRepository} from "./IndexDbRepository";
import {ReactiveRepository} from "./ReactiveRepository.svelte";
import type {DatabaseSchema, TableSchema} from "$lib/fluti/utils/repository/database/Schema";
import {PocketbaseRepository} from "$lib/fluti/utils/repository/PocketbaseRepository";
import type PocketBase from "pocketbase";
import type {Supplier} from "$lib/fluti/utils/methods";
import {CacheRepository} from "$lib/fluti/utils/repository/CacheRepository";

export class SimpleRepository {


    static open<T>(options: RepositoryOptions): Repository<T> {
        if (!options.databaseName)
            options.databaseName = "localDb"
        options.databaseVersion = 12

        if (options.schema !== undefined) {
            let schema: TableSchema = options.schema;
            options.name = schema.name;
            options.indexes = schema.indexes;
            options.key = schema.key;
            options.useIndexDb = true;
        }

        let dbOptions: DatabaseSchema = {
            name: options.databaseName,
            version: options.databaseVersion,
            tables: [
                {
                    name: options.name,
                    key: options.key,
                    indexes: options.indexes
                }
            ]
        }

        let repository: Repository<T> | undefined;
        if (options.useIndexDb)
            //@ts-ignore
            repository = new IndexedDBRepository(dbOptions, options)
        else if (options.usePocketbase)
            //@ts-ignore
            repository = new PocketbaseRepository(options);
        else
            //@ts-ignore
            repository = new InMemoryRepository(options)


        if (options.reactive)
            //@ts-ignore
            repository = new ReactiveRepository(repository)

        if (options.cache?.use)
            //@ts-ignore
            repository = new CacheRepository(options, repository)


        //@ts-ignore
        return repository;
    }
}

export type RepositoryOptions = {
    name: string// repository name name
    key: string //that to property of object that represent key
    useIndexDb?: boolean //if true data is stored inside indexDB, otherwise data is store in application memory
    usePocketbase?: boolean //if true data is stored inside pocketbase, otherwise data is store in application memory
    useSqlLite?: boolean //if true data is stored inside pocketbase, otherwise data is store in application memory
    reactive?: boolean //triggers an event when Insert/Update/Delete method are executed with success
    indexes?: string[] //names of columns that should be indexed
    databaseName?: string
    databaseVersion?: number
    schema?: TableSchema
    cache?: CacheOptions

    pocketbaseProvider?: Supplier<Promise<PocketBase>>
}

export type CacheOptions = {
    use: boolean, //if true cache is enabled
    poolSize?: number //maximal number or queries results cached in memory
    searchFrequency?: number  //when number of certain query extended then frequency it is added to cache
    expirationTime?: number //time after which element is removed from cache
}

export interface Repository<T> {

    name(): string

    insert(item: T): Promise<T | undefined>

    update(item: Partial<T>): Promise<T | undefined>

    delete(item: T | string): Promise<T | undefined>

    find(lambda: (item: T) => boolean): Promise<T[]>

    findAll(): Promise<T[]>

    findByKey(key: any): Promise<T | undefined>

    findByIndex(indexName: string, indexValue: any): Promise<T[]>

    findByQuery(query: string): Promise<T[]>;
}

