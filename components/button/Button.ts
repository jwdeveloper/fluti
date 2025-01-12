import type {Component, Snippet} from "svelte";
import type {HTMLButtonAttributes} from "svelte/elements";

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

