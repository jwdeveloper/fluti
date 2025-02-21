import type {i18Section} from "$lib/fluti/services/i18/translateTypes";

export interface SubscriptionPageTranslations {
    cancel: string
    select: string
    top: i18Section
}

export interface PaymentPeriodOptions {
    value: 'month' | 'year' | 'forever'
    name: string,
    description?: string
    formated?: string
}

export interface MakePaymentEvent {
    secret: string
}

export interface SubscriptionProductPrice {
    id: string
    value: number
    currency: string
    period: string
}

export interface SubscriptionProductFeature {
    name: string
    icon: string
}

export interface SubscriptionProduct {
    id: string
    name?: string
    price?: SubscriptionProductPrice
    prices?: SubscriptionProductPrice[]
    subtitle?: string
    features?: SubscriptionProductFeature[]
    meta?: {
        id?: string
        index?: string
        badge?: string
        badgeColor?: string
        discount?: string
        icon?: string
    }
}


export interface SubscriptionPageProps {
    stripePublicKey: string
    periodOptions?: PaymentPeriodOptions[]
    translations?: SubscriptionPageTranslations
    onFetchProducts?: (event: any) => Promise<SubscriptionProduct[]>
    onMakePayment?: (event: any) => Promise<MakePaymentEvent>
    productsOptions?: SubscriptionProduct[]
    templates?: {
        cardTemplate?: any
        titleTemplate?: any
        periodTemplate?: any
    }
}