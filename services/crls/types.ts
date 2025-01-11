export interface CrlsUser {
    isAnonymous: boolean;
    email: string;
    id: number,
    authId: string
    permissions: string[];
    roles: string[];

    hasPermission(permission: string): boolean;
}

export interface CrlsTableRules {

    all(): CrlsValidator

    insert(): CrlsValidator

    select(columns?: string): CrlsValidator

    update(): CrlsValidator

    delete(): CrlsValidator
}


export type CrlsValidatorData = {
    actionType: "insert" | "select" | "update" | "delete" | "all";

    //Query function is executed at the end of building Supabase query
    query?: (user: CrlsUser, query: any) => any;

    //Permission is checked before executing query
    permission?: string;

    //Role is checked before executing query
    role?: string;

    //Permission is checked before executing query
    userValidator?: (user: CrlsUser) => boolean;

    //Permission is checked before executing query
    bodyValidator?: (user: CrlsUser, body: any) => boolean | void;

    //Validator with the smallest priority number value is being selected [0, 1, 2, 3 ...]
    priority: number;

    //Allow anonymous users to execute this query
    allowAnonymous?: boolean;
}

export interface CrlsValidator {

    //modify query object before executing it
    query(expression: (user: CrlsUser, query: any) => void): CrlsValidator

    //user must have permission to execute this query
    permission(permission: string): CrlsValidator

    //user must have role to execute this query
    role(role: string): CrlsValidator

    //allow anonymous users to execute this query
    allowAnonymous(): CrlsValidator

    //validate user object before executing query
    user(prediction: (user: CrlsUser) => boolean): CrlsValidator

    //you can validate or modify body of request
    body(prediction: (user: CrlsUser, body: any) => boolean | void): CrlsValidator

    //default priority is 0, Validator with the lowest priority number value is being selected
    priority(priority: number): CrlsValidator
}