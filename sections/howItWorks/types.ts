import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";


export interface StepCardProps {

    item: StepData
    index: number
}

export interface StepData {

    image?: string
    icon: string
    title: string
    description: string
}

export interface HowItWorksSectionProps extends ElementProps {

    title: string
    subtitle: string
    summary: string
    steps: StepData[]
}