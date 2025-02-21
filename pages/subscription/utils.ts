export function bestPricePerDay(products: any, period: any) {

    let bestPrice = 999999999;
    let currency = "usd"
    for (let product of products) {
        //@ts-ignore
        let items = product?.prices?.filter(e => e.interval === period.value);
        //@ts-ignore
        if (items.length === 0)
            continue

        //@ts-ignore
        let item = items[0].price;
        let priceInt = parseInt(item)
        if (priceInt !== 0 && priceInt < bestPrice) {
            bestPrice = priceInt
            currency = items[0].currency;
        }
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
