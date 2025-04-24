import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

export interface FaqPanelItem {
    question: string
    answer: string
}

export interface FaqPanelItemAnimation {
    speed: number
    height: string
}

export interface FaqPanelProps extends ElementProps{
    items: FaqPanelItem[]
    showFirst?: boolean
    animation?: FaqPanelItemAnimation
    messages?: {
        title?: string
    }

}