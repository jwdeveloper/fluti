import type {CrlsTableRules, CrlsUser} from "$lib/fluti/services/crls/types";

import {CacheService} from "$lib/api/services/CacheService";
import type {RequestEvent} from "@sveltejs/kit";
import {CrlsTableValidatorImpl, CrlsValidatorImpl} from "$lib/fluti/services/crls/validator";

export const handlers = new CacheService();

export function crls(collection: string, method: (rules: CrlsTableRules) => void) {
    let validator = new CrlsTableValidatorImpl()
    method(validator)
    validator.build();
    handlers.set(collection.toLowerCase(), validator);
}

function applyQueryFilters(event: RequestEvent, query: any): any {

    let blackList = ["select", "limit", "offset", "order"];
    for (const [name, value] of event.url.searchParams.entries()) {
        if (blackList.includes(name))
            continue

        const split = value.split(".");
        const action = split[0]
        if (action === "eq") {
            query = query.eq(name, split[1]);
        }
        if (action === "like") {
            query = query.like(name, split[1]);
        }
        if (action === "not") {
            query = query.not(name, 'is', split[2]);
        }
    }
    return query;
}

function applyOrderFilter(event: RequestEvent, query: any): any {
    if (!event.url.searchParams.has("order"))
        return query;
    let value = event.url.searchParams.get("order")
    if (!value)
        return query;

    let fields = value.split(",")
    for (let field of fields) {
        let [name, action] = field.split(".")

        if (action === "asc")
            query = query.order(name, {ascending: true});
        if (action === "desc")
            query = query.order(name, {ascending: false});
    }

    return query;
}


export async function crlsHandleRequest(user: CrlsUser, supabaseClient: any, event: RequestEvent): Promise<any> {

    //console.log(event)

    //accept-profile:
    //content-profile

    let schema = "public";
    if (event.request.headers.has('accept-profile'))
        schema = event.request.headers.get('accept-profile') as string

    if (event.request.headers.has('content-profile'))
        schema = event.request.headers.get('content-profile') as string


    const table = event.url.pathname.replace("/supagateway/rest/v1/", "");

    const handlerName = `${schema}.${table}`.toLowerCase();

    if (!handlers.has(handlerName))
        throw new Error(`No handler found for ${handlerName}`);


    const tableValidator = handlers.get(handlerName) as CrlsTableValidatorImpl;
    const validators = tableValidator.find(event.request.method);
    const validator = findValidator(user, validators);
    console.log(event.request.method, "validators", validators.length)
    if (validator == null)
        throw new Error(`No valid validator for user ${JSON.stringify(user, null, 2)}`);


    let query: any = supabaseClient
        .schema(schema)
        .from(table);

    if (validator.data.actionType === "select") {
        const select = event.url.searchParams.get('select');
        if (select)
            query = query.select(select, {count: 'exact'});
        else
            query = query.select("*", {count: 'exact'});


        const limit = event.url.searchParams.get('limit');
        if (limit)
            query = query.limit(parseInt(limit));

        const offset = event.url.searchParams.get('offset');
        if (offset)
            query = query.range(parseInt(offset), parseInt(limit ?? "0") + parseInt(offset));


    }
    if (validator.data.actionType === "insert") {
        let body = await event.request.json();
        if (validator.data.bodyValidator && validator.data.bodyValidator(user, body) === false) {
            throw new Error("Invalid body");
        }
        query = query.insert(body)
        const select = event.url.searchParams.get('select');
        if (select)
            query = query.select(select);


    }
    if (validator.data.actionType === "update") {
        let body = await event.request.json();
        if (validator.data.bodyValidator && validator.data.bodyValidator(user, body) === false) {
            throw new Error("Invalid body");
        }
        query = query.update(body)

    }
    if (validator.data.actionType === "delete")
        query = query.delete();

    query = applyQueryFilters(event, query);
    query = applyOrderFilter(event, query);
    if (validator.data.query)
        query = validator.data.query(user, query);

    let result: any = await query;
    if (result.error)
        throw new Error(result.error.message);

    return result;
}

function findValidator(user: CrlsUser, actions: CrlsValidatorImpl[]): CrlsValidatorImpl | null {

    let selectedAction: CrlsValidatorImpl | null = null;
    for (let action of actions) {
        if (user.isAnonymous && !action.data.allowAnonymous) {
            console.log('FAILED User is anonymous')
            continue;
        }

        if (action.data.role && !user.roles.includes(action.data.role)) {
            console.log('FAILED User does not has role ' + action.data.role)
            continue;
        }

        if (action.data.permission && !user.permissions.includes(action.data.permission)) {
            console.log('FAILED User does not has permission ' + action.data.permission)
            continue;
        }

        if (action.data.userValidator && !action.data.userValidator(user)) {
            console.log('FAILED User fail with manual code validation');
            continue;
        }

        if (selectedAction == null)
            selectedAction = action;

        if (action.data.priority <= selectedAction.data.priority)
            selectedAction = action;
    }

    return selectedAction;
}

