import {CacheService} from "$lib/fluti/services/CacheService";
import * as fs from "node:fs";
import {parse, stringify} from 'yaml'
import path from 'path';

let cache = new CacheService();

function flattenObject(obj: Record<string, any>, parentKey = '', result: Record<string, string> = {}): Record<string, string> {
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
            flattenObject(value, fullKey, result);
        } else {
            result[fullKey] = String(value);
        }
    }
    return result;
}

export let loadTranslations = (pagePath: any, lang: any) => {
    try {
        const rootPath = process.cwd();
        const filePath = path.join(rootPath, 'src', "assets", 'i18', lang, 'layout.yml');
        console.log("Final translation path is", filePath)
        const yamlFile = fs.readFileSync(filePath, 'utf8');
        const data = parse(yamlFile, {});
        const flatten = flattenObject(data)


        cache.set(filePath, flatten);
        return flatten;
    } catch (err) {
        console.log(err)
        return undefined
    }
}