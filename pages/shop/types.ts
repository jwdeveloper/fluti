export interface ProductCardProps {

    item: Product;

    selectedOffer?: Offer

    onSelect?: (product: Product, offer: Offer | undefined) => void
    onAddToCart?: (product: Product, offer: Offer | undefined) => void
    onFilterOffers?: (product: Product) => Offer[]

    imageErrorTemplate?: any
    priceTemplate?: any
    offersTemplate?: any

    imageHeight?: number
    badges?: ProductCardBadge[]
}


export interface ProductCardBadge {
    color?: string
    name: string
    hint?: string
    icon?: string
    template?: any
    shouldDisplay: (product: Product, offer: Offer | undefined) => boolean
}

export interface Product {
    "@context": "https://schema.org/";
    "@type": "Product";
    name: string;
    description?: string;
    image?: string | string[];
    imageAlt?: string
    brand?: {
        "@type": "Brand";
        name: string;
    };
    sku?: string;
    mpn?: string;
    gtin13?: string;
    releaseDate?: string;
    offers: Offer[];
    aggregateRating?: {
        "@type": "AggregateRating";
        ratingValue: string;
        reviewCount: number;
    };
    review?: any[];
}

export interface Offer {
    "@type": "Offer";
    url: string;
    price: number;
    priceCurrency: string;
    name?: string
    description?: string
    image?: string;
    availability?: "https://schema.org/InStock" | "https://schema.org/OutOfStock" | string;
    itemCondition?: "https://schema.org/NewCondition" | "https://schema.org/UsedCondition" | string;
    seller?: {
        "@type": "Organization";
        name: string;
    };
    shippingDetails?: {
        "@type": "OfferShippingDetails";
        deliveryTime?: {
            "@type": "ShippingDeliveryTime";
            handlingTime?: {
                "@type": "QuantitativeValue";
                minValue?: number;
                maxValue?: number;
                unitCode?: string;
            };
        };
        shippingRate?: {
            "@type": "MonetaryAmount";
            value: number;
            currency: string;
        };
    };
    hasMerchantReturnPolicy?: {
        "@type": "MerchantReturnPolicy";
        returnPolicyCategory: string;
        merchantReturnDays?: number;
        returnMethod?: string;
        returnFees?: string;
    };
}

