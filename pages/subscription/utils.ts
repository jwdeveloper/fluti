import type {SubscriptionProduct} from "$lib/fluti/pages/subscription/types";

export function bestPricePerDay(products: SubscriptionProduct[], period: any) {

    let bestPrice = 999999999;
    let currency = "usd"
    for (let product of products) {
        //@ts-ignore
        let price = product.price?.value ?? 0
        if (price === 0)
            continue

        if (price < bestPrice) {
            bestPrice = price
            currency = product?.price?.currency ?? 'usd';
        }
    }
    if (period.value === 'week') {
        bestPrice = bestPrice / 700;
    }
    if (period.value === 'month') {
        bestPrice = bestPrice / 3000;
    }
    if (period.value === 'year') {
        bestPrice = bestPrice / 36000;
    }

    return {
        price: bestPrice.toFixed(2),
        currency: getCurrencySymbol(currency)
    }
}


export let getCurrencySymbol = (currency: string) => {
    if (currency === 'pln')
        return 'zł'

    if (currency === 'usd')
        return '$'

    if (currency === 'eur')
        return '€'

    return currency;
}

export function formatNumberString(numStr: string) {
    if (!/^\d+$/.test(numStr)) {
        return numStr;
    }
    const len = numStr.length;
    if (len <= 2) {
        const formatted = '0.' + numStr.padStart(2, '0');
        return formatted === '0.00' ? '0' : formatted;
    }
    const integerPart = numStr.slice(0, len - 2);
    const decimalPart = numStr.slice(-2);
    return decimalPart === '00' ? integerPart : `${integerPart}.${decimalPart}`;
}
