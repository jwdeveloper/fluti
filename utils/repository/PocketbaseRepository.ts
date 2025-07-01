import type {Repository, RepositoryOptions} from "./Repository";


export class PocketbaseRepository<T> implements Repository<T> {
    options: RepositoryOptions;

    constructor(options: RepositoryOptions) {
        this.options = options;
    }


    async getPocketbase() {
        if (this.options.pocketbaseProvider)
            return await this.options.pocketbaseProvider();

        let {pocketbaseClientAdmin} = await import("$lib/fluti/clients/pocketbase-client-admin")
        let admin = await pocketbaseClientAdmin()
        admin.autoCancellation(false)
        return admin;
    }

    name(): string {
        return this.options.name;
    }

    async findByIndex(indexName: string, indexValue: any): Promise<T[]> {
        if (!this.options.usePocketbase)
            return [];
        const filter = `${indexName} = "${indexValue}"`;
        const pb = await this.getPocketbase();
        const records = await pb.collection(this.options.name).getFullList<T>({
            filter,
        });
        return records;

    }

    async findByQuery(query: string): Promise<T[]> {
        if (!this.options.usePocketbase)
            return [];
        const pb = await this.getPocketbase();
        const records = await pb.collection(this.options.name).getFullList<T>({
            filter: query,
        });
        return records;
    }


    async insert(item: T): Promise<T | undefined> {
        if (!this.options.usePocketbase)
            return undefined;

        //@ts-ignore
        let key = item[this.options.key];
        if (key && key !== '') {
            let foundById = await this.findByKey(key);
            if (foundById !== undefined)
                return await this.update(item);
        }

        //@ts-ignore
        delete item[this.options.key]
        const pb = await this.getPocketbase();
        //@ts-ignore
        let result = await pb.collection(this.options.name).create<T>(item)

        return result;
    }

    async update(item: T): Promise<T | undefined> {
        if (!this.options.usePocketbase)
            return undefined;

        //@ts-ignore
        if (!item[this.options.key])
            throw new Error("Item must have an id for update");

        try {
            //@ts-ignore
            const pb = await this.getPocketbase();
            //@ts-ignore
            const updated = await pb.collection(this.options.name).update<T>(item[this.options.key], item);
            return updated;

        } catch (error) {
            if(error+"".includes("autocancelled")) {
                return undefined;
            }
            console.log('Error while update', error)
            // console.error(`Error updating item in collection ${this.options.name}:`, error);
            // throw error;
        }

    }

    async delete(item: T | string): Promise<T | undefined> {
        if (!this.options.usePocketbase) return undefined;
        //@ts-ignore
        const id = typeof item === "string" ? item : item[this.options.key];
        if (!id) throw new Error("Item must have an id to delete");
        const pb = await this.getPocketbase();
        const existing = await pb.collection(this.options.name).getOne<T>(id);
        await pb.collection(this.options.name).delete(id);
        return existing;
    }

    async findAll(): Promise<T[]> {
        if (!this.options.usePocketbase) return [];
        try {

            const pb = await this.getPocketbase();
            const records = await pb.collection(this.options.name).getFullList<T>();
            return records;
        } catch (e) {
            console.log(e)
        }
        return [];
    }

    async findByKey(key: any): Promise<T | undefined> {
        if (!this.options.usePocketbase)
            return undefined;
        try {
            const pb = await this.getPocketbase();
            const record = await pb.collection(this.options.name).getOne<T>(key);
            return record;
        } catch (error) {
            // console.error(`Error finding record by key ${key} in collection ${this.options.name}:`, error);
            return undefined;
        }

    }

    async find(lambda: (item: T) => boolean): Promise<T[]> {
        if (!this.options.usePocketbase) return [];
        const all = await this.findAll();
        return all.filter(lambda);
    }
}