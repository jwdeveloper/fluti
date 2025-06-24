import type {Repository, RepositoryOptions} from "./Repository";


export class CacheRepository<T> implements Repository<T> {

    private readonly repo: Repository<T>;
    private readonly options: RepositoryOptions

    constructor(options: RepositoryOptions, repo: Repository<T>) {
        this.options = options;
        this.repo = repo;
    }

    findByQuery(query: string): Promise<T[]> {
        throw new Error("Method not implemented.");
    }


    name(): string {
        return this.repo.name();
    }

    async insert(item: T): Promise<T | undefined> {
        return await this.repo.insert(item);
    }

    async update(item: T): Promise<T | undefined> {
        return await this.repo.update(item);
    }

    async delete(item: string | T): Promise<T | undefined> {
        return await this.repo.delete(item);
    }

    async find(lambda: (item: T) => boolean): Promise<T[]> {
        return await this.repo.find(lambda);
    }

    async findAll(): Promise<T[]> {
        return await this.repo.findAll();
    }

    async findByKey(key: any): Promise<T | undefined> {
        return await this.repo.findByKey(key);
    }

    async findByIndex(indexName: string, indexValue: any): Promise<T[]> {
        return await this.repo.findByIndex(indexName, indexValue);
    }

}