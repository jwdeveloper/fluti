export let validators = {
    email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    phone: '^\\+?[0-9\\s\\-()]{7,15}$'
}


export function isValueTrue(data: any) {
    return "" === data || !0 === data || 1 === data || data === true
}