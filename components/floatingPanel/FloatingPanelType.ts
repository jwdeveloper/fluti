import type {Snippet} from "svelte";

export interface FloatingPanelProps {
    isOpen?: boolean
    offset?: number,
    parentElement?: HTMLDivElement

    headerSlot: Snippet
    contentSlot: Snippet
}