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
    console.log(response)

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
    cardsOptions: [
        {
            key: 'free',
            icon: "fa fa-user"
        },
        {
            key: "pro",
            icon: "fas fa-bolt"
        },
        {
            key: 'enterprise',
            icon: "fa fa-crown"
        }],
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