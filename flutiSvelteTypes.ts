export interface FlutiWebSiteData {
    domain: string
    title?: string
    description?: string
    country?: string,
    pageType?: PageType
    pages?: CommonPages[]
    tweeter?:
        {
            title: string
            description: string
        }
    google?: {
        tagId?: string
        analyticsId?: string
    }
    stripe?: {
        url?: string
    }
}

export interface CommonPages {
    name: string,
    url: string
}

export type PageType =
    'website' |
    'article' |
    'product' |
    'video.other' |
    'music.song' |
    'event'

export type Direction = "left" | 'right' | 'top' | 'bottom'