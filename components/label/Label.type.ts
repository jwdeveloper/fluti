export interface LabelProps {
    title?: string
    description?: string
    error?: string | string[]
    onInfoClick?: () => void
    children?: any
    gap?: string
    style?: string
    labelColor?: string
    labelFor?: string
    labelStyle?: string
    fullHeight?: boolean
    invalid?: boolean
}