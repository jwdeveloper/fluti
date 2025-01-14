import {CacheService} from "$lib/fluti/services/CacheService";
import * as fs from "node:fs";
import {parse, stringify} from 'yaml'

let cache = new CacheService();

function flattenObject(obj: Record<string, any>, parentKey = '', result: Record<string, string> = {}): Record<string, string> {
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
            flattenObject(value, fullKey, result); // Recursively flatten nested objects
        } else {
            result[fullKey] = String(value); // Convert value to string
        }
    }
    return result;
}

export let loadTranslations = (path: any, lang: any) => {
    try {
        const rootPath = process.cwd();
        const filePath = rootPath + `/src/i18/${lang}/layout.yml`;

        // if (cache.has(filePath)) {
        //     return cache.get(filePath);
        // }

        const yamlFile = fs.readFileSync(filePath, 'utf8');
        const data = parse(yamlFile,{

        });
        const flatten = flattenObject(data)


        cache.set(filePath, flatten);
        return flatten;
    } catch (err) {
        console.log(err)
        return undefined
    }
}