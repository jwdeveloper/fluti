//@ts-ignore
import {STRIPE_KEY} from "$env/static/private";
import Stripe from "stripe";

let _client: Stripe;

export const stripeClient = () => {
    if (_client === undefined)
        _client = new Stripe(STRIPE_KEY as string, {})
    return _client;
};

