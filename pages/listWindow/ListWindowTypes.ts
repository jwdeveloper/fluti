import type {WindowHandle} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte.js";

export interface ListWindowProps {
    title?: string
    items?: any[]
    onSelect?: (item: any) => void
    window?: WindowHandle

    width?:string

    insert?: {
        formTemplate?: any
        enable: boolean,
        hint?: string
        onInsert?: (item: any) => void
    }

    remove?: {
        enable: boolean
        hint?: string,
        onRemove?: (item: any) => void
    }
}