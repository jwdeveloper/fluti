// Fetch product from Stripe
import type {FlutiUser} from "$lib/fluti/server/serverTypes";
//@ts-ignore
import {stripeClient} from "$lib/stripe-client";

export async function fetchProductById(client: any, productId: string) {
    try {
        const product = await client.products.retrieve(productId);
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

// Fetch price from Stripe
export async function fetchPriceById(client: any, priceId: string) {
    try {
        const price = await client.prices.retrieve(priceId);
        return price;
    } catch (error) {
        console.error("Error fetching price:", error);
        return null;
    }
}

export async function findOrCreateCustomer(user: FlutiUser) {
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
