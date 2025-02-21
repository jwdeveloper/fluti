import type {Context} from "hono";
import stripe from "stripe";


export async function handleWebhook(c: Context) {
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
}