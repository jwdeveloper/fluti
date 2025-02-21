import {Hono} from "hono";
import {stripeClient} from "$lib/stripe-client";
import {json} from "@sveltejs/kit";
import type {FlutiUser} from "$lib/fluti/server/serverTypes";
import {pocketbaseClient} from "$lib/pocketbase-client";
import stripe from "stripe";

let usePaymentsMiddleware = new Hono()

let mapPrice = (price: any) => {
    return {
        id: price.id,
        currency: price.currency,
        price: price.unit_amount,
        interval: price?.recurring?.interval ?? 'forever',
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

usePaymentsMiddleware.post("/webhook", async (c) => {

    console.log('siema mamy webhook')
    const sig = c.req.header('stripe-signature');
    const rawBody = c.req.raw.body;
    let event;
    const endpointSecret = 'whsec_5bb2d74afce40ef3f720ad1faafb336ef4c0ada85061215609a1776370fadd9c'
    try {
        //@ts-ignore
        event = stripe.webhooks.constructEvent(rawBody, sig!, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return c.text(`Webhook Error: ${err.message}`, 400);
    }

    // Handle Stripe events
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent succeeded:', paymentIntent);
            break;

        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Checkout Session completed:', session);
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return c.text('Webhook received', 200);
})


usePaymentsMiddleware.get("/products-test", async (event) => {
    const products = await stripeClient().products.list();
    const mapped = []
    for (let product of products.data) {
        mapped.push(await mapProduct(product))
    }
    return event.json(mapped)
})

usePaymentsMiddleware.get("/products", async (event) => {
    const products = await stripeClient().products.list();
    const mapped = []
    for (let product of products.data) {
        mapped.push(await mapProduct(product))
    }
    return event.json(mapped)
})


usePaymentsMiddleware.get('/:status/:id', async (event) => {

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
    await pocketbaseClient.collection("_superusers").authWithPassword('admin@admin.com', '12345678')
    let collection = pocketbaseClient.collection('transaction');
    await collection.create({
        userId: user.id,
        status: status,
        transactionId: transactionId,
    });
    return event.redirect('http://localhost:5173/');
});

type PaymentRequest = {
    productId: string
    priceId: string
}

// Fetch product from Stripe
async function fetchProductById(client: any, productId: string) {
    try {
        const product = await client.products.retrieve(productId);
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

// Fetch price from Stripe
async function fetchPriceById(client: any, priceId: string) {
    try {
        const price = await client.prices.retrieve(priceId);
        return price;
    } catch (error) {
        console.error("Error fetching price:", error);
        return null;
    }
}

usePaymentsMiddleware.post("/", async (event, b) => {

    let paymentData = await event.req.json() as PaymentRequest;
    if (!paymentData.productId)
        return json({error: 'Product id not provided'}, {status: 500});
    if (!paymentData.priceId)
        return json({error: 'Price id not provided'}, {status: 500});


    //@ts-ignore
    let user = event.get("user") as FlutiUser
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
        return_url: `http://localhost:5173/api/v1/payment/success/{CHECKOUT_SESSION_ID}`,
        locale: "pl",
    });

    return event.json({secret: session.client_secret});
})

async function findOrCreateCustomer(user: FlutiUser) {
    let client = stripeClient();
    try {
        const customers = await client.customers.list({
            email: user.email,
            limit: 1,
        });
        if (customers.data.length > 0) {
            console.log('Customer already exists:', customers.data[0].id);
            return customers.data[0];
        }
        const customer = await client.customers.create({
            email: user.email,
            name: user.login,
        });
        console.log('New customer created:', customer.id);
        return customer;
    } catch (error) {
        console.error('Error finding or creating customer:', error);
        return null;
    }
}


export default usePaymentsMiddleware




