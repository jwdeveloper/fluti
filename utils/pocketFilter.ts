export class PocketFilter {
    eq(name: string | object, value?: any) {
        return this.getExpression(name, "?=", value);
    }

    in(name: string, values: string[]) {
        if (!values)
            return ""

        let processedValue = values.filter(e => e !== undefined && e !== null)

        if (processedValue.length === 0)
            return ""

        let value = "( "
        let counter = 0;
        for (let item of processedValue) {
            counter++;
            if (item === undefined)
                continue

            value += `${name} = "${item}"`
            if (counter <= processedValue.length - 1)
                value += " || "
        }

        value += " )"
        return value;
    }

    getExpression(object: string | object, operator: string, value: any): string {
        if (typeof object === 'object') {
            let query = Object.entries(object)
                .map(([key, val]) => {
                    return this.getExpression(key, operator, val)
                })
                .join(' && ');
            if (query.endsWith((' && '))) {
                query = query.replace(' && ', '')
            }
            return query
        }

        if (value === undefined)
            return ''

        if (typeof value === 'object') {
            let props = Object.entries(value)
                .map(([key, val]) => {
                    return this.getExpression(object + "." + key, operator, val)
                })
                .join(' && ');
            return props
        }

        return `${object}${operator}${typeof value === 'string' ? `"${value}"` : value}`;
    }

}


export let pocketFilter = new PocketFilter();
