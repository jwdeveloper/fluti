import PocketBase from 'pocketbase';
//@ts-ignore
import {PocketbaseCollectionWrapper} from "$lib/fluti/clients/pocketbaseCollectionWrapper";

let url = process.env.PUBLIC_ENV === "dev" ? process.env.PUBLIC_LOCAL_POCKETBASE_URL : process.env.PUBLIC_POCKETBASE_URL;


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

    console.log('Updating pocketbase clieknt', login, password)
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


export async function pocketbaseCollection(collectionName: string): Promise<PocketbaseCollectionWrapper> {
    let client = await pocketbaseClientAdmin();
    let collection = client.collection(collectionName);
    let pocketCollection = new PocketbaseCollectionWrapper(collection);
    return pocketCollection;
}
