import type {SubscriptionPageProps} from "$lib/fluti/pages/subscription/types";


export const handleGetProducts = async () => {
    const response = await fetch("/api/products")
    if (!response.ok)
        throw new Error(response.statusText)
    const body = await response.json();
    if (body?.success === false) throw new Error(body?.error ?? "Failed to load products");
    return body?.data ?? body;
}

export const handleMakePayment = async (event: any) => {

    const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
    if (!response.ok)
        throw new Error(response.statusText)
    const body = await response.json();
    if (body?.success === false) throw new Error(body?.error ?? "Failed to create payment");
    const payload = body?.data ?? body;
    return {
        secret: payload.clientSecret,
        ...payload,
    };
}

const defaultSubscriptionPageData: SubscriptionPageProps = {

    onFetchProducts: handleGetProducts,
    onMakePayment: handleMakePayment,
    stripePublicKey: '',
    translations: {
        cancel: "cancel",
        select: "select",
        top: {
            title: "Find the best prices",
            subtitle: "start the journey today"
        }
    },
    productsOptions: [
        {
            id: 'default',
            subtitle: "standard and free option",
            meta: {
                icon: 'fa fa-user'
            }
        },
        {
            id: 'pro',
            subtitle: "for people who know what they want",
            meta: {
                icon: 'fas fa-bolt'
            }
        },
        {
            id: 'expert',
            subtitle: "for advanced use cases",
            meta: {
                icon: 'fa fa-crown'
            }
        }
    ],
    periodOptions: [
        {
            value: 'month',
            name: 'Monthly',
            description: "Get access to all features, starting from {{price}}{{currency}} per day - cancel at any moment",
            formated: "monthly"
        },
        {
            value: 'year',
            name: 'Yearly',
            description: "Get access to all features, starting from {{price}}{{currency}} per day - cancel at any moment",
            formated: "yearly"

        },
        {
            value: 'forever',
            name: 'Forever',
            description: "Get life-time license for this service",
            formated: "one time"
        }
    ]
}

export default defaultSubscriptionPageData;
