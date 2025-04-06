import type {SubscriptionPageProps} from "$lib/fluti/pages/subscription/types";


export const handleGetProducts = async () => {
    const response = await fetch("/api/v1/payment/products")
    if (!response.ok)
        throw new Error(response.statusText)
    return await response.json();
}

export const handleMakePayment = async (event: any) => {

    const response = await fetch('/api/v1/payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
    if (!response.ok)
        throw new Error(response.statusText)
    return await response.json();
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