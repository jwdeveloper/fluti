import PocketBase from 'pocketbase';
import {PUBLIC_ENV, PUBLIC_LOCAL_POCKETBASE_URL, PUBLIC_POCKETBASE_URL} from "$env/static/public";

let url = PUBLIC_ENV === "dev" ? PUBLIC_LOCAL_POCKETBASE_URL : PUBLIC_POCKETBASE_URL;

// Store admin sessions with timestamps
type SessionData = { client: PocketBase; createdAt: number };
const sessions = new Map<string, SessionData>();
const ONE_HOUR = 60 * 30 * 1000;

//@ts-ignore
export async function pocketbaseClientAdmin(login?: string, password?: string):Promise<PocketBase> {
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

