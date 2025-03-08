import {CookieWindowControllerSvelte} from "$lib/fluti/pages/cookies/cookieWindowController.svelte";

export interface CookiePageMessages {
    acceptAll: string
    customize: string

    tabs: {
        agreements: string
        details: string
        aboutCookie: string
    }
}


export interface CookiePage {

    controller: CookieWindowControllerSvelte
    translations: CookiePageMessages
}

export enum CookieCategoryType {
    necessary,
    preferences,
    statistics,
    marketing,
    unclassified
}

export interface CookieCategoryData {
    type: CookieCategoryType
    title: string
    description: string
}

export interface CookieProviderData {
    name: string
    id: string
    items: CookieItemData[]
}

export interface CookieItemData {

    title: string
    description: string
    duration: string
    type: string
    providerId: string
    categoryId: CookieCategoryType
}