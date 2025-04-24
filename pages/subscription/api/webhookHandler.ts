import stripe from "stripe";
import type {Context} from "hono";
import {pocketbaseClientAdmin} from "$lib/fluti/clients/pocketbase-client-admin";
import {STRIPE_KEY} from "$env/static/private";

//http://localhost:5173/api/payment/webhook
//stripe trigger payment_intent.created
// stripe listen --forward-to http://localhost:5173/api/payment/webhook
// stripe trigger payment_intent.succeeded


async function getEvent(c: Context) {
    const sig = c.req.header('stripe-signature');

    const rawBody = await c.req.text();
    if (rawBody === null)
        return false

    return stripe.webhooks.constructEvent(rawBody, sig!, STRIPE_KEY);
}

export async function handleWebhook(c: Context) {
    console.log('webhook event init!')
    try {
        const event = await getEvent(c);
        if (event === false) {
            console.log('unexpected error while handling webhook')
            return c.json({error: 'unexpected error'})
        }

        const pocketbase = await pocketbaseClientAdmin();
        const subscriptions = await pocketbase.collection('subscriptions');
        console.log('webhook event!', event.type)

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
        return c.json({event: event.data})

    } catch (error) {
        // console.log('error webhook', error)
        return c.json({error: error})
    }
}