import {
    type CookieCategoryData,
    CookieCategoryType,
    type CookieProviderData
} from "$lib/fluti/pages/cookies/cookiePageTypes";

export let providers: CookieProviderData[] = [
    {
        id: 'google',
        name: 'google',
        items: [
            {
                title: 'Collecting google analytics',
                description: 'It collects the google annalists data',
                providerId: 'google',
                categoryType: CookieCategoryType.statistics,
            },
            {
                title: 'Collecting google adds',
                description: 'It collects the google annalists data',
                providerId: 'google',
                categoryType: CookieCategoryType.marketing,
            }
        ],
    }
]

export let categories: CookieCategoryData[] = [
    {
        title: 'Necessary',
        type: CookieCategoryType.necessary,
        description: 'Necessary cookies help make a website usable by enabling basic functions like page navigation and access to secure areas of the website. The website cannot function properly without these cookies.'
    },
    {
        type: CookieCategoryType.preferences,
        title: 'Preferences',
        description: 'Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.'
    },
    {
        type: CookieCategoryType.statistics,
        title: 'Statistics',
        description: 'Statistic cookies help website owners to understand how visitors interact with websites by collecting and reporting information anonymously.'
    },
    {
        type: CookieCategoryType.marketing,
        title: 'Marketing',
        description: 'Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.'
    },
    {
        type: CookieCategoryType.unclassified,
        title: 'Unclassified',
        description: 'Unclassified cookies are cookies that we are in the process of classifying, together with the providers of individual cookies.'
    }
]