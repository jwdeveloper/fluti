import {type RecordFullListOptions, type RecordListOptions, type RecordModel, RecordService} from "pocketbase";
import {PocketFilter} from "$lib/fluti/utils/pocketFilter";
import {Optional} from "$lib/fluti/utils/optional";

export class PocketbaseCollectionWrapper {
    collection: RecordService

    constructor(collection: RecordService) {
        this.collection = collection;
    }

    async all<T = RecordModel>(action: (filter: PocketFilter) => string, options?: RecordFullListOptions): Promise<T[]> {
        const result = new PocketFilter();
        const filter = action(result);

        const fullOptions = {
            filter: filter,
            ...options
        };

        try {
            const result = await this.collection.getFullList(fullOptions);
            //@ts-ignore
            return result;
        } catch (error) {
            console.log(error);
        }
        return [];
    }

    async first<T = RecordModel>(action: (filter: PocketFilter) => string, options?: RecordListOptions): Promise<Optional<T>> {
        const result = new PocketFilter();
        const filter = action(result);

        try {
            const item = await this.collection.getFirstListItem(filter, options) as T;
            return Optional.success(item);
        } catch (error) {
            //@ts-ignore
            if (error?.status === 404)
                return Optional.fail(`not found: ${filter}`);

            console.log(error)
            return Optional.fail(`error ${error}`);
        }
    }

    /**
     * Create a new record in the collection
     * @param data The data to insert
     * @returns An Optional containing the created record or error
     */
    async create<T = RecordModel>(data: Record<string, any>): Promise<Optional<T>> {
        try {
            const record = await this.collection.create(data) as T;
            return Optional.success(record);
        } catch (error) {
            console.error("Create error:", error);
            return Optional.fail(`Failed to create record: ${error}`);
        }
    }

    /**
     * Update an existing record by ID
     * @param id The ID of the record to update
     * @param data The data to update
     * @returns An Optional containing the updated record or error
     */
    async update<T = RecordModel>(id: string, data: Record<string, any>): Promise<Optional<T>> {
        try {
            const record = await this.collection.update(id, data) as T;
            return Optional.success(record);
        } catch (error) {
            console.error("Update error:", error);
            //@ts-ignore
            if (error?.status === 404) {
                return Optional.fail("Record not found");
            }
            return Optional.fail(`Failed to update record: ${error}`);
        }
    }

    /**
     * Delete a record by ID
     * @param id The ID of the record to delete
     * @returns A boolean indicating success or failure
     */
    async delete(id: string): Promise<boolean> {
        try {
            await this.collection.delete(id);
            return true;
        } catch (error) {
            console.error("Delete error:", error);
            return false;
        }
    }

    /**
     * Update a record if it exists, otherwise create it
     * @param id The ID of the record to update (optional for creation)
     * @param data The data to update or create with
     * @returns An Optional containing the updated or created record
     */
    async upsert<T = RecordModel>(id: string | null, data: Record<string, any>): Promise<Optional<T>> {
        if (id) {
            try {
                // Check if record exists
                await this.collection.getOne(id);
                // Record exists, update it
                return this.update<T>(id, data);
            } catch (error) {
                //@ts-ignore
                if (error?.status === 404) {
                    // Record doesn't exist, create it
                    return this.create<T>(data);
                }
                return Optional.fail(`Failed to check record existence: ${error}`);
            }
        } else {
            // No ID provided, create new record
            return this.create<T>(data);
        }
    }

    /**
     * Get a record by ID
     * @param id The ID of the record to retrieve
     * @returns An Optional containing the record or error
     */
    async getById<T = RecordModel>(id: string): Promise<Optional<T>> {
        try {
            const record = await this.collection.getOne(id) as T;
            return Optional.success(record);
        } catch (error) {
            //@ts-ignore
            if (error?.status === 404) {
                return Optional.fail("Record not found");
            }
            return Optional.fail(`Failed to retrieve record: ${error}`);
        }
    }

    /**
     * Batch update multiple records that match a filter
     * @param action Filter builder function
     * @param data The data to update
     * @returns The number of records updated
     */
    async batchUpdate(action: (filter: PocketFilter) => string, data: Record<string, any>): Promise<number> {
        const result = new PocketFilter();
        const filter = action(result);

        try {
            // First get all matching records
            const records = await this.collection.getFullList({filter});

            // Update each record
            const updatePromises = records.map(record =>
                this.collection.update(record.id, data)
            );

            const results = await Promise.allSettled(updatePromises);

            // Count successful updates
            return results.filter(result => result.status === 'fulfilled').length;
        } catch (error) {
            console.error("Batch update error:", error);
            return 0;
        }
    }
}