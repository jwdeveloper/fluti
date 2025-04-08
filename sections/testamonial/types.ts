import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

export interface TestamonialSectionProps extends ElementProps {
    title: string
    subtitle: string

    testamonialsProps?: ElementProps
    testamonialProps?: ElementProps

    testamonialTemplate?: any

    items?: Testamonial[]
}

export interface TestamonialElementProps extends ElementProps {
    item: Testamonial
    index: number
}


export interface Testamonial {
    stars: number
    quote: string
    picture: string
    name: string
    position: string
    companyName: string
}