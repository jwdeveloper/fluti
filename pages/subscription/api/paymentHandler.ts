import type {FlutiUser} from "$lib/fluti/server/serverTypes";

import type {Context} from "hono";
import {json} from "@sveltejs/kit";
import {stripeClient} from "$lib/stripe-client";
import {fetchPriceById, fetchProductById, findOrCreateCustomer} from "$lib/fluti/pages/subscription/api/_common";
import {pocketbaseClientAdmin} from "$lib/fluti/clients/pocketbase-client-admin";


type PaymentRequest = {
    productId: string
    priceId: string
}

export async function registerPayment(event: Context) {
    // @ts-ignore
    let user = event.get("user") as FlutiUser
    if (!user) {
        return event.json({error: "User is required"}, {status: 400});
    }
    const status = event.req.param("status");
    const transactionId = event.req.param("id");
    if (!transactionId) {
        return event.json({error: "Transaction ID is required"}, {status: 400});
    }

    let pocketbase = await pocketbaseClientAdmin();
    let collection = pocketbase.collection('transaction');
    await collection.create({
        userId: user.id,
        status: status,
        transactionId: transactionId,
    });
    const url = new URL(event.req.url);
    const returnUrl = `${url.protocol}//${url.host}`;
    return event.redirect(returnUrl);
}

export async function createPaymentSession(event: Context) {

    let paymentData = await event.req.json() as PaymentRequest;
    if (!paymentData.productId)
        return json({error: 'Product id not provided'}, {status: 400, statusText: 'product not provided'});
    if (!paymentData.priceId)
        return json({error: 'Price id not provided'}, {status: 400, statusText: 'price not provided'});


    //@ts-ignore
    let user = event.get("user") as FlutiUser
    if (!user)
        return event.json({error: 'User not provided'}, {status: 400, statusText: 'User not provided'});

    const client = stripeClient()


    const customer = await findOrCreateCustomer(user);
    if (!customer)
        return json({error: 'Error creating customer'}, {status: 500});

    const product = await fetchProductById(client, paymentData.productId);
    if (!product)
        return json({error: 'Product not found'}, {status: 404});

    const price = await fetchPriceById(client, paymentData.priceId);
    if (!price)
        return json({error: 'Price not found'}, {status: 404});

    const url = new URL(event.req.url);
    const returnUrl = `${url.protocol}//${url.host}/api/v1/payment/success/{CHECKOUT_SESSION_ID}`;

    const session = await client.checkout.sessions.create({
        payment_method_types: ["blik", "p24", "paypal", "card"],
        customer_email: user.email,
        ui_mode: 'embedded',
        line_items: [
            {
                price_data: {
                    currency: price.currency,
                    product_data: {
                        name: product.name,
                        images: [product.imageUrl],
                    },
                    unit_amount: price.unit_amount,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        return_url: returnUrl,
        locale: "pl",
    });
    return event.json({secret: session.client_secret});
}