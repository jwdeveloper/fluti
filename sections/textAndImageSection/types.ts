import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
import type {TitleAndTextElementProps} from "$lib/fluti/sections/common/types";


export interface TextAndImageSectionProps extends ElementProps {
    items?: TextAndImageSectionItem[]
    glowStrength: string
}


export interface TextAndImageSectionItemProps extends ElementProps {
    item: TextAndImageSectionItem
    key: string | number
    glowStrength: string

}

export interface TextAndImageSectionItem extends TitleAndTextElementProps {
    image: string
}