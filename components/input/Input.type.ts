export interface InputProps {

    id?: string,
    placeholder?: string,
    className?: string,
    readonly?: boolean,
    error?: boolean,
    required?: boolean,
    value?: any,
    type?: string
    disabled?: boolean,
    iconSymbol?: string,
    icon?: string,
    variant?: "input-normal" | "input-border" | '',
    onClick?: (i: any) => void,
    onValueChanged?: (i: any) => void,
    onKeydown?: (i: KeyboardEvent) => void,
    onKeyup?: (i: KeyboardEvent) => void,
    style?: string
    children?: any
}