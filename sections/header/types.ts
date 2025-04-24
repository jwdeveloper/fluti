import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
import type {LogoElementProps} from "$lib/fluti/sections/common/types";

export interface HeaderSectionProps extends ElementProps {
    icon?: string
    hideAfterScroll?: boolean
    treashold?: number
    addSpace?: boolean
    showLogin?: boolean
    showThemes?: boolean
    items?: HeaderItem[]
    children?: any
    logo?: LogoElementProps
    companyInfo?: CompanyContactBarProps
}

export interface HeaderItem {
    name: string
    key?: string
    link?: string
    icon?: string
    onClick?: () => void
}


export interface CompanyContactBarProps extends ElementProps {
    phone?: CompanyContactValue
    email?: CompanyContactValue
    address?: CompanyContactValue
}

export interface CompanyContactValue {
    value: string
    icon: string
}


export interface HeaderLogoProps {
    logoUrl?: string
    logoHeight?: number
    title: string
    icon?: string
}