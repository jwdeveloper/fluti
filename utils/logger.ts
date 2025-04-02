import {PUBLIC_ENV} from "$env/static/public";


export function DEV_LOGGER(a: any, b?: any, c?: any, d?: any, e?: any): void {
    if (PUBLIC_ENV !== 'prod') {
        console.log(a, b, c, d, e);
    }
}