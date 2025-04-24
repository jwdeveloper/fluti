import {Hono} from "hono";
import {getProducts} from "$lib/fluti/pages/subscription/api/productHandler";
import {handleWebhook} from "$lib/fluti/pages/subscription/api/webhookHandler";
import {createPaymentSession, registerPayment} from "$lib/fluti/pages/subscription/api/paymentHandler";
import {pocketbaseClientAdmin} from "$lib/fluti/clients/pocketbase-client-admin";


const usePaymentsMiddleware = new Hono()
usePaymentsMiddleware.post("/", createPaymentSession)
usePaymentsMiddleware.get("/products", getProducts)
usePaymentsMiddleware.get('/:status/:id', registerPayment);
usePaymentsMiddleware.post("/webhook", handleWebhook)
// usePaymentsMiddleware.get("/products", (e)=>
// {
//     return e.text("ada");
// })
// usePaymentsMiddleware.basePath("/payment")

async function createCollection() {
    try {
        const name = 'subscriptions'
        const pocketbase = await pocketbaseClientAdmin();
        const users = await pocketbase.collections.getOne('users');
        const subscriptionsCollection = {
            name: name,
            type: 'base',
            fields: [
                {
                    name: 'userId',
                    type: 'relation',
                    required: true,
                    collectionId: users.id,
                    options: {
                        collectionId: users.id,
                    }
                },
                {
                    name: 'type',
                    type: 'text'
                },
                {
                    name: 'expiresAt',
                    type: 'date'
                }
            ]
        };

        // Create the Collection
        const collection = await pocketbase.collections.create(subscriptionsCollection);
        console.log("Subscriptions Collection Created:", collection);
    } catch (error) {

        //@ts-ignore
        if (error?.response?.data?.name?.message === 'Collection name must be unique (case insensitive).')
            return

        //@ts-ignore
        console.error("Error creating collection:", error?.response?.data, error?.response?.data?.fields);
    }

}


async function updateAllSubscriptionStatuses() {

}

async function setupPaymentsApi() {
    // await createCollection();
    // await updateAllSubscriptionStatuses();
}

await setupPaymentsApi();

export default usePaymentsMiddleware




