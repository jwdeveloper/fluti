import PocketBase from 'pocketbase';
import {PUBLIC_POCKETBASE_URL, PUBLIC_ENV, PUBLIC_LOCAL_POCKETBASE_URL} from "$env/static/public";

let url = PUBLIC_ENV === "dev" ? PUBLIC_LOCAL_POCKETBASE_URL : PUBLIC_POCKETBASE_URL;

let admin;

export async function pocketbaseClientAdmin(login?: string, password?: string): PocketBase {
    if (admin) {
        return admin;
    }
    login = login ?? 'admin@admin.com'
    password = password ?? '1234567890'

    try {
        let pocketbase = new PocketBase(url);
        await pocketbase.collection('_superusers').authWithPassword(login, password);
        admin = pocketbase;
        return pocketbase;
    } catch (error) {
        console.log("Can connect to datavase", url, login, password)
        console.log(error)
        throw new Error(error)
    }

}

