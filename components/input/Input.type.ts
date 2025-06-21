import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

export interface InputProps {

    id?: string,
    placeholder?: string,
    className?: string,
    readonly?: boolean,
    required?: boolean,
    value?: any,
    type?: string
    disabled?: boolean,
    iconSymbol?: string,
    onClick?: (i: any) => void,
    onValueChanged?: (i: any) => void,
    onKeydown?: (i: KeyboardEvent) => void,
    onKeyup?: (i: KeyboardEvent) => void,
}

export interface InputProps2 extends ElementProps {
    placeholder?: string,
    readonly?: boolean,
    autofocus?: boolean,
    required?: boolean,
    invalid?: boolean,
    regex?: string
    pattern?: string
    value?: any,

    type?: InputType
    variant?: 'outline' | 'filled'
    disabled?: boolean,
    onClick?: (i: any) => void,
    onIconClick?: (i: any) => void
    icon?: string
    inputMode?: string
    textIcon?: string
    focus?: boolean

    style?: string
}

export type InputType = undefined | 'text' | 'number' | 'email' | 'password' | 'tel' | 'url' |
    'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' |
    'color' | 'file' | 'checkbox' | 'radio' | 'range' | 'hidden' | 'submit' |
    'reset' | 'button' | 'image'