import {Hono} from "hono";
import {getProducts} from "$lib/fluti/pages/subscription/api/productHandler";
import {handleWebhook} from "$lib/fluti/pages/subscription/api/webhookHandler";
import {createPaymentSession, registerPayment} from "$lib/fluti/pages/subscription/api/paymentHandler";

let usePaymentsMiddleware = new Hono()
usePaymentsMiddleware.get("/products", getProducts)
usePaymentsMiddleware.post("/webhook", handleWebhook)
usePaymentsMiddleware.post("/", createPaymentSession)
usePaymentsMiddleware.get('/:status/:id', registerPayment);

export default usePaymentsMiddleware




