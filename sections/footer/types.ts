import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

export interface FooterMessages {
    allRightsReserved: "wszystkie prawa zastrzeżone"
}

export interface FooterLinksColumns {
    title: string
    links: FooterLinks[]
}

export interface FooterLinks {
    name: string
    url: string
}

export interface FooterCompanyInfo {
    companyName: string
    slogan?: string
    email?: string
    address?: string
    phone?: string
    workingHours?: string
}

export interface FooterSectionProps extends ElementProps {
    messages?: FooterMessages
    linksColumns: FooterLinksColumns[]
    companyInfo: FooterCompanyInfo

    logoUrl: string
    showLogo: boolean
}