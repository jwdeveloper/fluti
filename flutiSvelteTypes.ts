export interface FlutiWebSiteData {
    domain: string
    title?: string
    description?: string
    country?: string,
    tweeter?:
        {
            title: string
            description: string
        }
    google?: {
        tagId?: string
    }
}