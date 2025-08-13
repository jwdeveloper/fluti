import type {RepositoryOptions} from "$lib/fluti/utils/repository/Repository";
import {and, eq} from "drizzle-orm";
import {generateUUID} from "$lib/fluti/utils/Wait";
import {Optional} from "$lib/fluti/utils/optional";
import type {IDbConnection, IRepository} from "$lib/fluti/utils/repository2/IRepository";

export interface SqlLiteRepoConfig extends RepositoryOptions {
    connection: IDbConnection
    tableName: string
    tableSchema: any
    primaryKey?: string
}

export class SqlRepository<T> implements IRepository<T> {

    connection: IDbConnection
    config: SqlLiteRepoConfig
    primaryKey: string

    constructor(config: SqlLiteRepoConfig) {
        this.connection = config.connection;
        this.config = config;
        this.primaryKey = config.primaryKey || 'id';
    }

    findOneByField(field: string, value: any): Promise<Optional<T>> {
        let data = {}
        //@ts-ignore
        data[field] = value;
        return this.findOneByFields(data)
    }

    async upsert(item: T): Promise<Optional<T>> {
        try {
            const key = this.primaryKey;
            // Check if the item has a primary key
            if (item[key as keyof T]) {
                // If it has a primary key, check if the record exists
                const db = await this.connection();
                const existingItem = await db.select()
                    .from(this.config.tableSchema)
                    .where(eq(this.config.tableSchema[key], item[key as keyof T] as any))
                    .limit(1);

                if (existingItem && existingItem.length > 0) {
                    // Record exists, update it
                    return this.update(item);
                }
            }

            // If no primary key or record doesn't exist, insert as new
            return this.insert(item);
        } catch (error) {
            console.error(`Error upserting in ${this.config.tableName}:`, error);
            return Optional.fail(`Error upserting in ${this.config.tableName}:`);
        }
    }

    name(): string {
        return this.config.name;
    }

    async insert(item: T): Promise<Optional<T>> {
        try {
            if (!item[this.primaryKey as keyof T]) {
                let id = generateUUID()
                item[this.primaryKey as keyof T] = id as any;
            }

            for (let field in item) {
                if (typeof item[field as keyof T] === 'object') {
                    //@ts-ignore
                    item[field as keyof T] = JSON.stringify(item[field as keyof T]);
                }
            }

            const db = await this.connection();
            const result = await db.insert(this.config.tableSchema).values(item as any).returning({
                id: this.config.tableSchema[this.primaryKey],
            });

            item[this.primaryKey as keyof T] = result[0].id as any;
            if (!item[this.primaryKey as keyof T])
                return Optional.fail(`New item create by ID has not been assigned ${this.config.tableName}:`);

            return Optional.of(item);
        } catch (error) {
            console.error(`Error inserting into ${this.config.tableName}:`, error);
            return Optional.fail(`Error inserting into ${this.config.tableName}:`);
        }
    }

    async update(item: Partial<T>): Promise<Optional<T>> {
        try {
            const db = await this.connection();
            const key = this.primaryKey;

            if (!item[key as keyof T]) {
                return Optional.fail(`Primary key '${key}' not found in item for update`);
            }

            for (let property in item) {
                if (typeof item[property] === 'object') {
                    //@ts-ignore
                    item[property] = JSON.stringify(item[property]);
                }
            }

            const result = await db.update(this.config.tableSchema)
                .set(item as any)
                .where(eq(this.config.tableSchema[key], item[key as keyof T] as any))
                .returning();


            //@ts-ignore
            return Optional.of(result[0] as T);
        } catch (error) {
            console.error(`Error updating in ${this.config.tableName}:`, error);
            return Optional.fail(`Error updating in ${this.config.tableName}:`);
        }
    }

    async delete(item: string | T): Promise<Optional<T>> {
        try {
            const db = await this.connection();
            const key = this.primaryKey;
            let keyValue: any;

            if (typeof item === 'string') {
                keyValue = item;
            } else {
                keyValue = item[key as keyof T];
                if (!keyValue) {
                    return Optional.fail(`Primary key '${key}' not found in item for deletion`);
                }
            }

            const result = await db.delete(this.config.tableSchema)
                .where(eq(this.config.tableSchema[key], keyValue))
                .returning();


            //@ts-ignore
            return Optional.success(result[0] as T);
        } catch (error) {
            console.error(`Error deleting from ${this.config.tableName}:`, error);
            return Optional.fail(`Error deleting from ${this.config.tableName}:`);
        }
    }

    async find(lambda: (item: T) => boolean): Promise<Optional<T[]>> {
        try {
            const allItems = await this.findMany();
            if (allItems.isFail())
                return allItems;
            return Optional.of(allItems.get().filter(lambda));
        } catch (error) {
            console.error(`Error finding in ${this.config.tableName}:`, error);
            return Optional.fail(`Error finding in ${this.config.tableName}:`);
        }
    }

    async findMany(): Promise<Optional<T[]>> {
        try {
            const db = await this.connection();
            const result = await db.select().from(this.config.tableSchema);
            return Optional.of(result as T[]);
        } catch (error) {
            console.error(`Error finding all in ${this.config.tableName}:`, error);
            return Optional.fail(`Error finding all in ${this.config.tableName}:`);
        }
    }

    async findOneById(key: any): Promise<Optional<T>> {
        try {
            const db = await this.connection();
            const result = await db.select()
                .from(this.config.tableSchema)
                .where(eq(this.config.tableSchema[this.primaryKey], key))
                .limit(1);

            return Optional.of(result[0] as T);
        } catch (error) {
            console.error(`Error finding by id in ${this.config.tableName}:`, error);
            return Optional.fail(`Error finding by key in ${this.config.tableName}:`);
        }
    }

    async findOneByFields(fields: Record<string, any>): Promise<Optional<T>> {
        let result = await this.findManyByFields(fields, {limit: 1});
        if (result.isFail()) {
            return Optional.fail(`Error finding by fields in ${this.config.tableName}:`);
        }
        let items = result.get();
        if (items.length === 0) {
            return Optional.fail(`No results found for fields in ${this.config.tableName}: ${JSON.stringify(fields)}`);
        }
        return Optional.success(items[0]);
    }

    async findManyByField(indexName: string, indexValue: any): Promise<Optional<T[]>> {
        try {
            const db = await this.connection();
            const result = await db.select()
                .from(this.config.tableSchema)
                .where(eq(this.config.tableSchema[indexName], indexValue));

            return Optional.of(result);
        } catch (error) {
            console.error(`Error finding by index in ${this.config.tableName}:`, error);
            return Optional.fail(`Error finding by index in ${this.config.tableName}:`);
        }
    }

    async findManyByFields(fields: Record<string, any>, options?: any): Promise<Optional<T[]>> {
        try {
            const db = await this.connection();
            const conditions = Object.entries(fields).map(([key, value]) => {
                const column = this.config.tableSchema[key];
                if (!column) throw new Error(`Unknown column: ${key}`);
                return eq(column, value);
            });

            let query = db
                .select()
                .from(this.config.tableSchema)
                .where(conditions.length > 1 ? and(...conditions) : conditions[0]);

            if (options?.limit) {
                //@ts-ignore
                query = query.limit(options.limit);
            }

            let result = await query;

            return Optional.of(result);
        } catch (error) {
            console.error(`Error finding by fields in ${this.config.tableName}:`, error);
            return Optional.fail(`Error finding by fields in ${this.config.tableName}:`);
        }
    }

    async findOneByQuery(query: string): Promise<Optional<T>> {
        let result = await this.findManyByQuery(query, {limit: 1});
        if (result.isFail() || result.get().length === 0) {
            return Optional.fail(`No results found for query in ${this.config.tableName}: ${query}`);
        }
        let items = result.get();
        if (items.length === 0) {
            return Optional.fail(`No results found for query in ${this.config.tableName}: ${query}`);
        }
        return Optional.success(items[0]);
    }

    async findManyByQuery(query: string, options?: any): Promise<Optional<T[]>> {
        try {
            const db = await this.connection();

            // Add LIMIT only if it's not already in the query
            let finalQuery = query.trim().replace(/;$/, ''); // Remove trailing semicolon
            if (options?.limit && !/limit\s+\d+/i.test(finalQuery)) {
                finalQuery += ` LIMIT ${options.limit}`;
            }
            const result = db.all(finalQuery);

            // @ts-ignore
            return Optional.of(result);
        } catch (error) {
            console.error(`Error executing custom query in ${this.config.tableName}:`, error);
            return Optional.fail(`Error executing custom query in ${this.config.tableName}:`);
        }
    }
}