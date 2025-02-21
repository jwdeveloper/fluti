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

export interface SubscriptionProduct {

}

export interface SubscriptionPageProps {
    stripePublicKey: string
    periodOptions?: PaymentPeriodOptions[]
    translations?: SubscriptionPageTranslations
    onFetchProducts: (event: any) => Promise<SubscriptionProduct[]>
    onMakePayment: (event: any) => Promise<MakePaymentEvent>
    templates?: {
        cardTemplate?: any
        titleTemplate?: any
        periodTemplate?: any
    }
}