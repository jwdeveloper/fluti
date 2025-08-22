import type {RepositoryOptions} from "$lib/fluti/utils/repository/Repository";
import {and, asc, desc, eq, gt, gte, lt, lte, or} from "drizzle-orm";
import {generateUUID} from "$lib/fluti/utils/Wait";
import {Optional} from "$lib/fluti/utils/optional";
import type {IDbConnection, IRepository, QueryOptions, Where} from "$lib/fluti/utils/repository2/IRepository";

export interface SqlLiteRepoConfig extends RepositoryOptions {
    connection: IDbConnection
    tableName: string
    tableSchema: any
    primaryKey?: string
}

export class SqlRepository<T extends Record<string, any>> implements IRepository<T> {

    connection: IDbConnection
    config: SqlLiteRepoConfig
    primaryKey: string

    constructor(config: SqlLiteRepoConfig) {
        this.connection = config.connection;
        this.config = config;
        this.primaryKey = config.primaryKey || 'id';
    }

    name(): string {
        return this.config.name;
    }

    findOneByField(field: string, value: any): Promise<Optional<T>> {
        return this.findOneByFields({[field]: value});
    }

    async upsert(item: T): Promise<Optional<T>> {
        const pk = this.primaryKey as keyof T;
        if (item[pk]) {
            const existing = await this.findOneById(item[pk]);
            if (existing.isSuccess()) {
                return this.update(item);
            }
        }
        return this.insert(item);
    }

    async insert(item: T): Promise<Optional<T>> {
        try {
            const pk = this.primaryKey as keyof T;
            if (!item[pk]) {
                item[pk] = generateUUID() as any;
            }
            for (const f in item) {
                const v = item[f];
                if (typeof v === 'object' && v !== null) {
                    item[f] = JSON.stringify(v) as any;
                }
            }
            const db = await this.connection();
            let insertedId: any;
            try {
                const rows = await db
                    .insert(this.config.tableSchema)
                    .values(item as any)
                    .returning({[this.primaryKey]: this.config.tableSchema[this.primaryKey]});
                insertedId = rows?.[0]?.[this.primaryKey];
            } catch {
                // fallback (SQLite bez returning)
                await db.insert(this.config.tableSchema).values(item as any);
                insertedId = item[pk];
            }
            if (!insertedId)
                return Optional.fail(`Insert failed in ${this.config.tableName}`);
            item[pk] = insertedId;
            return Optional.success(item);
        } catch (e) {
            console.error(`Error inserting into ${this.config.tableName}:`, e);
            return Optional.fail(`Error inserting into ${this.config.tableName}:`);
        }
    }

    async update(item: Partial<T>): Promise<Optional<T>> {
        try {
            const pk = this.primaryKey as keyof T;
            if (!item[pk])
                return Optional.fail(`Primary key '${String(pk)}' not found in item for update`);
            const db = await this.connection();
            for (const f in item) {
                const v = item[f];
                if (typeof v === 'object' && v !== null) {
                    item[f] = JSON.stringify(v) as any;
                }
            }
            let row: any;
            try {
                const rows = await db.update(this.config.tableSchema)
                    .set(item as any)
                    .where(eq(this.config.tableSchema[this.primaryKey], item[pk] as any))
                    .returning({[this.primaryKey]: this.config.tableSchema[this.primaryKey]});
                row = rows?.[0];
            } catch {
                await db.update(this.config.tableSchema)
                    .set(item as any)
                    .where(eq(this.config.tableSchema[this.primaryKey], item[pk] as any));
                const selected = await db.select()
                    .from(this.config.tableSchema)
                    .where(eq(this.config.tableSchema[this.primaryKey], item[pk] as any))
                    .limit(1);
                row = selected?.[0];
            }
            if (!row) return Optional.fail(`Update failed in ${this.config.tableName}`);
            return Optional.success(row as T);
        } catch (e) {
            console.error(`Error updating in ${this.config.tableName}:`, e);
            return Optional.fail(`Error updating in ${this.config.tableName}:`);
        }
    }

    async delete(item: string | T): Promise<Optional<T>> {
        try {
            const pk = this.primaryKey as keyof T;
            const db = await this.connection();
            const keyValue = typeof item === 'string' ? item : item[pk];
            if (!keyValue)
                return Optional.fail(`Primary key '${String(pk)}' not found for delete`);
            let row: any;
            try {
                const rows = await db.delete(this.config.tableSchema)
                    .where(eq(this.config.tableSchema[this.primaryKey], keyValue))
                    .returning({[this.primaryKey]: this.config.tableSchema[this.primaryKey]});
                row = rows?.[0];
            } catch {
                // brak returning - nie mamy usuniętego rekordu; zwracamy tylko PK
                row = {[this.primaryKey]: keyValue};
            }
            return Optional.success(row as T);
        } catch (e) {
            console.error(`Error deleting from ${this.config.tableName}:`, e);
            return Optional.fail(`Error deleting from ${this.config.tableName}:`);
        }
    }

    async find(lambda: (item: T) => boolean): Promise<Optional<T[]>> {
        const all = await this.findMany();
        if (all.isFail()) return all;
        return Optional.success(all.get().filter(lambda));
    }

    async findMany(options?: QueryOptions): Promise<Optional<T[]>> {
        try {
            const db = await this.connection();
            const schema = this.config.tableSchema;
            let query = db.select().from(this.config.tableSchema);

            // WHERE conditions
            if (options?.where) {
                let where = options?.where
                const operatorMap: Record<string, any> = {
                    "=": eq,
                    ">": gt,
                    "<": lt,
                    ">=": gte,
                    "<=": lte,
                };

                const whereClauses = where.map((condition: Where) => {
                    const field = schema[condition.field as keyof typeof schema];
                    const operator = operatorMap[condition.operator];
                    return operator(field, condition.value);
                });

                const andConditions = whereClauses.filter(
                    (clause, index) =>
                        !where[index].connector ||
                        where[index].connector === "and",
                );
                const orConditions = whereClauses.filter(
                    (clause, index) => where[index].connector === "or",
                );

                const finalCondition = and(...andConditions);
                if (orConditions.length > 0) {
                    //@ts-ignore
                    query = query.where(or(finalCondition, ...orConditions));
                } else {
                    //@ts-ignore
                    query = query.where(finalCondition);
                }
            }

            // SORT
            if (options?.sort) {
                let filters = []
                for (let key in options.sort) {
                    const field = schema[key as keyof typeof schema];
                    if (options.sort[key] === 'desc')
                        filters.push(desc(field))
                    else
                        filters.push(asc(field))
                }
                //@ts-ignore
                query = query.orderBy(...filters);
            }

            // LIMIT
            if (typeof options?.limit === "number") {
                //@ts-ignore
                query = query.limit(options.limit);
            }

            // OFFSET
            if (typeof options?.offset === "number") {
                //@ts-ignore
                query = query.offset(options.offset);
            }

            const result = await query;
            return Optional.success(result as T[]);
        } catch (e) {
            console.error(`Error finding all in ${this.config.tableName}:`, e);
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
            if (!result[0]) return Optional.fail('Not found');
            return Optional.success(result[0] as T);
        } catch (e) {
            console.error(`Error finding by id in ${this.config.tableName}:`, e);
            return Optional.fail(`Error finding by key in ${this.config.tableName}:`);
        }
    }

    async findOneByFields(fields: Record<string, any>): Promise<Optional<T>> {
        const many = await this.findManyByFields(fields, {limit: 1});
        if (many.isFail()) return many.returnError();
        const arr = many.get();
        if (!arr.length) return Optional.fail('Not found');
        return Optional.success(arr[0]);
    }

    async findManyByField(field: string, value: any, options?: QueryOptions): Promise<Optional<T[]>> {
        return this.findManyByFields({[field]: value}, options);
    }

    async findManyByFields(fields: Record<string, any>, options?: QueryOptions): Promise<Optional<T[]>> {
        let where = options?.where ?? []
        for (let field in fields) {
            where.push({
                field: field,
                operator: '=',
                value: fields[field],
                connector: 'and'
            })
        }
        return await this.findMany({
            ...options,
            where: where
        })

        // try {
        //     const db = await this.connection();
        //     const conditions = Object.entries(fields).map(([k, v]) => {
        //         const col = this.config.tableSchema[k];
        //         if (!col) throw new Error(`Unknown column: ${k}`);
        //         return eq(col, v);
        //     });
        //     let query = db.select().from(this.config.tableSchema);
        //     if (conditions.length === 1) {
        //         query = query.where(conditions[0]);
        //     } else if (conditions.length > 1) {
        //         query = query.where(and(...conditions));
        //     }
        //     if (options?.limit) {
        //         // @ts-ignore
        //         query = query.limit(options.limit);
        //     }
        //     const result = await query;
        //     return Optional.success(result as T[]);
        // } catch (e) {
        //     console.error(`Error finding by fields in ${this.config.tableName}:`, e);
        //     return Optional.fail(`Error finding by fields in ${this.config.tableName}:`);
        // }
    }

    async findOneByQuery(query: string): Promise<Optional<T>> {
        const many = await this.findManyByQuery(query, {limit: 1});
        if (many.isFail()) return many.returnError();
        const arr = many.get();
        if (!arr.length) return Optional.fail('Not found');
        return Optional.success(arr[0]);
    }

    async findManyByQuery(query: string, options?: QueryOptions): Promise<Optional<T[]>> {
        try {
            const db = await this.connection();
            let finalQuery = query.trim().replace(/;$/, '');
            if (options?.limit && !/limit\s+\d+/i.test(finalQuery)) {
                finalQuery += ` LIMIT ${options.limit}`;
            }
            const result = db.all(finalQuery);
            // @ts-ignore
            return Optional.success(result);
        } catch (e) {
            console.error(`Error executing custom query in ${this.config.tableName}:`, e);
            return Optional.fail(`Error executing custom query in ${this.config.tableName}:`);
        }
    }
}