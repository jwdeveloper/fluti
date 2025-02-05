export class PocketFilter {
    eq(name: string | object, value?: any) {
        return this.getExpression(name, "=", value);
    }

    getExpression(object: string | object, operator: string, value: any): string {
        if (typeof object === 'object') {
            return Object.entries(object)
                .map(([key, val]) => this.getExpression(key, operator, val))
                .join(' && ');
        }
        return `${object}${operator}${typeof value === 'string' ? `"${value}"` : value}`;
    }

}


export let pocketFilter = new PocketFilter();
