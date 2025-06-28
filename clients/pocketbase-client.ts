import PocketBase from 'pocketbase';

//TODO check it if variables will works in this way
function getUrl() {
    const env = process.env.PUBLIC_ENV;
    const localUrl = process.env.PUBLIC_LOCAL_POCKETBASE_URL;
    const prodUrl = process.env.PUBLIC_POCKETBASE_URL;

    return env === 'dev' ? localUrl : prodUrl;
}

export const pocketbaseClient = new PocketBase(getUrl());