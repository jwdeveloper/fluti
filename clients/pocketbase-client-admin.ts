import PocketBase from 'pocketbase';
import {PUBLIC_POCKETBASE_URL, PUBLIC_ENV, PUBLIC_LOCAL_POCKETBASE_URL} from "$env/static/public";
let url = PUBLIC_ENV === "dev" ? PUBLIC_LOCAL_POCKETBASE_URL : PUBLIC_POCKETBASE_URL;

let admin;

export async function pocketbaseClientAdmin(): PocketBase {
    if (admin) {
        return admin;
    }
    let pocketbase = new PocketBase(url);
    await pocketbase.collection('_superusers').authWithPassword('admin@admin.com', '12345678');
    admin = pocketbase;
    return pocketbase;
}

