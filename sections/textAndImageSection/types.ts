import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";


export interface TextAndImageSectionProps extends ElementProps {
    items?: TextAndImageSectionItem[]
}

export interface TextAndImageSectionItem {
    subTitle: string,
    title: string,
    text: string
    color: string
    image: string
}