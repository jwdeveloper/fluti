import type {OneOrMore} from "$lib/fluti/server/serverTypes";
import {CacheService} from "$lib/fluti/services/CacheService";

let data: any = undefined;
let service = new CacheService();

export function setupTranslate(translations: any) {
    data = translations.i18;
}

export function t(path: string, params?: OneOrMore<any>) {

    if (!data)
        return 'TRANSLATION NOT LOADED';

    if (params && service.has(path))
        return service.get(path);


    let value = data[path];
    if (!value)
        return `TRANSLATION NOT FOUND ${path}`

    if (params) {

        if (!Array.isArray(params))
            params = [params];
        let index = 0;
        let signature = path;
        value = value.replace(/\$\{[^}]+\}/g, () => {
            const replacement = params[index] || '';
            signature += replacement;
            index++;
            return replacement;
        })
        service.set(signature, value);
    }
    return value;
}