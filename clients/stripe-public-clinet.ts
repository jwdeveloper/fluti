import {PUBLIC_STRIPE_KEY} from "$env/static/public";
import Stripe from "stripe";

let _client: Stripe;

export const stripePublicClient = () => {
    if (_client === undefined)
        _client = new Stripe(PUBLIC_STRIPE_KEY as string, {})
    return _client;
};

