import type {Variant} from "$lib/fluti/themes/themeTypes";

export interface LogoElementProps {

    showLogo?: boolean
    url?: string
    name?: string
    slogan?: string
}

export interface TitleAndTextElementProps {
    color?: string
    subTitle: string
    title: string
    text?: string
    spaceSize?: Variant
    textWidth?: string
    textColor?: string
}

