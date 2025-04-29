import PocketBase, {type RecordListOptions, type RecordModel, RecordService} from 'pocketbase';
import {PUBLIC_ENV, PUBLIC_LOCAL_POCKETBASE_URL, PUBLIC_POCKETBASE_URL} from "$env/static/public";
import {PocketFilter, pocketFilter} from "$lib/fluti/utils/pocketFilter";

let url = PUBLIC_ENV === "dev" ? PUBLIC_LOCAL_POCKETBASE_URL : PUBLIC_POCKETBASE_URL;

// Store admin sessions with timestamps
type SessionData = { client: PocketBase; createdAt: number };
const sessions = new Map<string, SessionData>();
const ONE_HOUR = 60 * 30 * 1000;

//@ts-ignore
export async function pocketbaseClientAdmin(login?: string, password?: string): Promise<PocketBase> {
    login = login ?? 'admin@admin.com'
    password = password ?? '1234567890'

    const key = `${login}:${password}`;
    const now = Date.now();

    const existing = sessions.get(key);
    if (existing && now - existing.createdAt < ONE_HOUR) {
        return existing.client;
    }

    try {
        let pocketbase = new PocketBase(url);
        await pocketbase.collection('_superusers').authWithPassword(login, password);
        sessions.set(key, {client: pocketbase, createdAt: now});
        return pocketbase;
    } catch (error) {
        console.log("Can connect to database", url, login, password)
        console.log(error)
    }
}

export async function pocketbaseCollection(collection: string): Promise<RecordService> {
    let client = await pocketbaseClientAdmin();
    return client.collection(collection)
}


export async function getPocketCollection(collectionName: string): Promise<PocketbaseCollection> {
    let client = await pocketbaseClientAdmin();
    let collection = client.collection(collectionName);
    let pocketCollection = new PocketbaseCollection(collection);
    return pocketCollection;
}

export class PocketbaseCollection {
    collection: RecordService

    constructor(collection: RecordService) {
        this.collection = collection;
    }

    async first(action: (filter: PocketFilter) => string, options?: RecordListOptions): Promise<RecordModel | undefined> {
        let result = new PocketFilter();
        let filter = action(result)
        try {
            let result = await this.collection.getFirstListItem(filter, options);
            return result;
        } catch (error) {
            if (error?.status === 404)
                return undefined;

            console.log(error)
        }
        return undefined;
    }
}

