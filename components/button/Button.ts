import type {Component, Snippet} from "svelte";
import type {HTMLButtonAttributes} from "svelte/elements";
import type {PanelProps} from "$lib/fluti/components/panel/Panel.type";
import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
import type {Variant} from "$lib/fluti/themes/themeTypes";

export interface ButtonProps extends HTMLButtonAttributes {
    variant?: 'btn-normal' | 'btn-filled' | 'btn-outline' | 'btn-outline-light';
    size?: 'btn-normal' | 'btn-small' | 'btn-medium';
    icon?: string;
    fullWidth?: boolean;
    className?: string;
    style?: string;
    disabled?: boolean,
    onClick?: (x: MouseEvent) => void;
    onMouseOver?: (isOver: boolean, x: MouseEvent) => void;
    isLoading?: boolean,
    children?: Snippet
}

export interface Button2Props extends ElementProps {
    variant?: 'outline' | 'filled' | 'text'
    size?: Variant //size of the button margin
    textSize?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' //size of the button text based on element type
    disabled?: boolean //bindable
    isLoading?: boolean //bindable
    loadingOptions?: {
        showText?: boolean //if true shows button content.  Default - true
        showIcon?: boolean //if false shows icon and display loader on the opposite side to icon. Default - true
    }
    fullWidth?: boolean
    icon?: string
    iconPosition?: 'left' | 'right'
    isShowText?:boolean //set to false when you want to show icon in full width button
}
