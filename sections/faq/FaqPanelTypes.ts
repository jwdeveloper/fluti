export interface FaqPanelItem {
    question: string
    answer: string
}

export interface FaqPanelItemAnimation {
    speed: number
    height: string
}

export interface FaqPanelProps {
    items: FaqPanelItem[]
    showFirst?: boolean
    animation?: FaqPanelItemAnimation
    messages?: {
        title?: string
    }
}