import type {IRepository} from "$lib/core/server/repositories/IRepository";
import type {Optional} from "$lib/fluti/utils/optional";

export class EmptyRepository implements IRepository<any> {
    findOneByField(field: string, value: any): Promise<Optional<any>> {
        throw new Error("Method not implemented.");
    }
    name(): string {
        throw new Error("Method not implemented.");
    }

    insert(item: any): Promise<Optional<any>> {
        throw new Error("Method not implemented.");
    }

    update(item: Partial<any>): Promise<Optional<any>> {
        throw new Error("Method not implemented.");
    }

    upsert(item: any): Promise<Optional<any>> {
        throw new Error("Method not implemented.");
    }

    delete(item: any): Promise<Optional<any>> {
        throw new Error("Method not implemented.");
    }

    find(lambda: (item: any) => boolean): Promise<Optional<any[]>> {
        throw new Error("Method not implemented.");
    }

    findOneById(key: any): Promise<Optional<any>> {
        throw new Error("Method not implemented.");
    }

    findOneByQuery(query: string): Promise<Optional<any>> {
        throw new Error("Method not implemented.");
    }

    findOneByFields(fields: Record<string, any>): Promise<Optional<any>> {
        throw new Error("Method not implemented.");
    }

    findMany(): Promise<Optional<any[]>> {
        throw new Error("Method not implemented.");
    }

    findManyByQuery(query: string): Promise<Optional<any[]>> {
        throw new Error("Method not implemented.");
    }

    findManyByField(field: string, value: any): Promise<Optional<any[]>> {
        throw new Error("Method not implemented.");
    }

    findManyByFields(fields: Record<string, any>): Promise<Optional<any[]>> {
        throw new Error("Method not implemented.");
    }

}