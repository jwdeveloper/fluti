import {stripeClient} from "$lib/stripe-client";
import type {Context} from "hono";


let mapPrice = (price: any) => {
    return {
        id: price.id,
        currency: price.currency,
        value: price.unit_amount,
        period: price?.recurring?.interval ?? 'forever',
    }
}

let mapProduct = async (product: any) => {
    let stripePrices = await stripeClient().prices.list({product: product.id})
    let prices = stripePrices.data.map(mapPrice);
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        features: product.marketing_features,
        meta: product.metadata,
        prices: prices
    }
}

export async function getProducts(event:Context) {
    const products = await stripeClient().products.list();
    const mapped = []
    for (let product of products.data) {
        mapped.push(await mapProduct(product))
    }
    return event.json(mapped)
}

