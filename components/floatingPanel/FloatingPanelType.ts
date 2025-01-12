import type {Snippet} from "svelte";

export interface FloatingPanelProps {
    isOpen: boolean
    parentElement?: HTMLDivElement

    headerSlot: Snippet
    contentSlot: Snippet
}