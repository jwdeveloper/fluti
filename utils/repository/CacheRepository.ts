import type {Repository, RepositoryOptions} from "./Repository";

// Let's define a simple cache structure
type CacheEntry<T> = {
    data: T | T[];
    timestamp: number;
};

export class CacheRepository<T> implements Repository<T> {
    private readonly repo: Repository<T>;
    private readonly options: RepositoryOptions;
    private cache: Map<string, CacheEntry<T>> = new Map();

    // Default cache expiration time in milliseconds (5 minutes)
    private readonly defaultTTL = 5 * 60 * 1000;

    constructor(options: RepositoryOptions, repo: Repository<T>) {
        this.options = options;
        this.repo = repo;
    }

    private getCacheTTL(): number {
        return this.options.cache?.expirationTime || this.defaultTTL;
    }

    private isCacheEnabled(): boolean {
        return this.options.cache?.use !== false;
    }

    private isCacheValid(cacheKey: string): boolean {
        if (!this.isCacheEnabled()) return false;

        const cachedItem = this.cache.get(cacheKey);
        if (!cachedItem) return false;

        const now = Date.now();
        return now - cachedItem.timestamp < this.getCacheTTL();
    }

    private setCacheItem(cacheKey: string, data: T | T[]): void {
        if (!this.isCacheEnabled()) return;

        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }

    private clearCache(): void {
        this.cache.clear();
    }

    findByQuery(query: string): Promise<T[]> {
        const cacheKey = `query:${query}`;

        if (this.isCacheValid(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            return Promise.resolve(cachedData!.data as T[]);
        }

        return this.repo.findByQuery(query).then(result => {
            this.setCacheItem(cacheKey, result);
            return result;
        });
    }

    name(): string {
        return this.repo.name();
    }

    async insert(item: T): Promise<T | undefined> {
        // Clear cache on write operations
        this.clearCache();
        return await this.repo.insert(item);
    }

    async update(item: T): Promise<T | undefined> {
        // Clear cache on write operations
        this.clearCache();
        return await this.repo.update(item);
    }

    async delete(item: string | T): Promise<T | undefined> {
        // Clear cache on write operations
        this.clearCache();
        return await this.repo.delete(item);
    }

    async find(lambda: (item: T) => boolean): Promise<T[]> {
        // Using a simple hash for the lambda function
        const cacheKey = `find:${lambda.toString()}`;

        if (this.isCacheValid(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            return cachedData!.data as T[];
        }

        const result = await this.repo.find(lambda);
        this.setCacheItem(cacheKey, result);
        return result;
    }

    async findAll(): Promise<T[]> {
        const cacheKey = `findAll:${this.name()}`;

        if (this.isCacheValid(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            return cachedData!.data as T[];
        }

        const result = await this.repo.findAll();
        this.setCacheItem(cacheKey, result);
        return result;
    }

    async findByKey(key: any): Promise<T | undefined> {
        const cacheKey = `findByKey:${String(key)}`;

        if (this.isCacheValid(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            return cachedData!.data as T;
        }

        const result = await this.repo.findByKey(key);
        if (result) {
            this.setCacheItem(cacheKey, result);
        }
        return result;
    }

    async findByIndex(indexName: string, indexValue: any): Promise<T[]> {
        const cacheKey = `findByIndex:${indexName}:${String(indexValue)}`;

        if (this.isCacheValid(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            return cachedData!.data as T[];
        }

        const result = await this.repo.findByIndex(indexName, indexValue);
        this.setCacheItem(cacheKey, result);
        return result;
    }
}