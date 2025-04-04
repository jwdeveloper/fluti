import PocketBase from 'pocketbase';
import {PUBLIC_ENV, PUBLIC_LOCAL_POCKETBASE_URL, PUBLIC_POCKETBASE_URL} from "$env/static/public";

let url = PUBLIC_ENV === "dev" ? PUBLIC_LOCAL_POCKETBASE_URL : PUBLIC_POCKETBASE_URL;
export const pocketbaseClient = new PocketBase(url);


