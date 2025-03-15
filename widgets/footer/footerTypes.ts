import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

export interface SocialMediaLink {
    url: string
    name?: string
    icon?: string
    iconColor?: string
}

export interface LinkData {
    name: string
    url: string
}

export interface LinkSection {
    title: string
    links: LinkData[]
}

export interface FooterProps extends ElementProps {
    templates?: {
        logo?: any;
        center?: any
    };
    domain: string
    socialMedia?: {
        linkedIn?: SocialMediaLink
        tweeter?: SocialMediaLink
        facebook?: SocialMediaLink
        tiktok?: SocialMediaLink
        youtube?: SocialMediaLink
    }
    logo?: {
        name?: string;
        slogan?: string;
        icon?: string
        image?: string;
    };
    links?: LinkSection[]
    separator?: boolean
}
