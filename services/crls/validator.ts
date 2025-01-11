import type {CrlsTableRules, CrlsUser, CrlsValidator, CrlsValidatorData} from "$lib/fluti/services/crls/types";


export class CrlsTableValidatorImpl implements CrlsTableRules {

    actions: CrlsValidatorImpl[] = [];

    all(): CrlsValidator {
        //@ts-ignore
        let validator = new CrlsValidatorImpl("all");
        this.actions.push(validator);
        return validator;
    }

    insert(): CrlsValidator {
        let validator = new CrlsValidatorImpl("insert");
        this.actions.push(validator);
        return validator;
    }

    select(columns?: string): CrlsValidator {
        let validator = new CrlsValidatorImpl("select");
        this.actions.push(validator);
        return validator;
    }

    update(): CrlsValidator {
        let validator = new CrlsValidatorImpl("update");
        this.actions.push(validator);
        return validator;
    }

    delete(): CrlsValidator {
        let validator = new CrlsValidatorImpl("delete");
        this.actions.push(validator);
        return validator;
    }

    build(): boolean {
        for (let global of this.actions.filter(e => e.data.actionType === "all")) {
            this.actions.push(new CrlsValidatorImpl("select", {...global.data}));
            this.actions.push(new CrlsValidatorImpl("delete", {...global.data}));
            this.actions.push(new CrlsValidatorImpl("insert", {...global.data}));
            this.actions.push(new CrlsValidatorImpl("update", {...global.data}));
        }
        this.actions = this.actions.filter(e => e.data.actionType !== "all");
        return true;
    }

    find(actionsType: string): CrlsValidatorImpl[] {
        switch (actionsType) {
            case "POST":
                return this.actions.filter(e => e.data.actionType === "insert");
            case "GET":
                return this.actions.filter(e => e.data.actionType === "select");
            case "PATCH":
                return this.actions.filter(e => e.data.actionType === "update");
            case "DELETE":
                return this.actions.filter(e => e.data.actionType === "delete");
        }
        throw new Error(`Unknown action type ${actionsType}`);
    }
}


export class CrlsValidatorImpl implements CrlsValidator {

    data: CrlsValidatorData

    constructor(action: "insert" | "select" | "update" | "delete", data?: CrlsValidatorData) {
        this.data = {
            actionType: action,
            allowAnonymous: false,
            priority: 0,
        }
        if (data !== undefined) {
            this.data = data;
            this.data.actionType = action;
        }
    }

    body(prediction: (user: CrlsUser, body: any) => boolean | void): CrlsValidator {
        this.data.bodyValidator = prediction;
        return this;
    }

    role(role: string): CrlsValidator {
        this.data.role = role;
        return this;
    }

    allowAnonymous(): CrlsValidator {
        this.data.allowAnonymous = true;
        return this;
    }

    query(expression: (user: CrlsUser, query: any) => void): CrlsValidator {
        this.data.query = expression;
        return this;
    }

    permission(permission: string): CrlsValidator {
        this.data.permission = permission;
        return this;
    }

    user(prediction: (user: CrlsUser) => boolean): CrlsValidator {
        this.data.userValidator = prediction;
        return this;
    }

    priority(priority: number): CrlsValidator {
        this.data.priority = priority;
        return this;
    }

}