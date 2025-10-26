import PocketBase from 'pocketbase';
import {browser} from "$app/environment";

//TODO check it if variables will works in this way
async function getUrl() {

    if (browser) {
        let data = await import("$env/static/public")
        const env = data.PUBLIC_ENV;
        const localUrl = data.PUBLIC_LOCAL_POCKETBASE_URL;
        const prodUrl = data.PUBLIC_POCKETBASE_URL;
        const url = env === 'dev' ? localUrl : prodUrl;
        // console.log('URL IS', url)
        return env === 'dev' ? localUrl : prodUrl;
    }

    const env = process.env.PUBLIC_ENV;
    const localUrl = process.env.PUBLIC_LOCAL_POCKETBASE_URL;
    const prodUrl = process.env.PUBLIC_POCKETBASE_URL;
    return env === 'dev' ? localUrl : prodUrl;
}

let client: PocketBase | undefined = undefined;
export const pocketbaseClient = async () => {
    if (client)
        return client;
    client = new PocketBase(await getUrl())
    return client;
};