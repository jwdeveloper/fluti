import type {Breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointType";

export interface PanelProps {
    panelType?: "flex" | "grid"
    gap?: string
    padding?: string
    justify?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | "",
    align?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | "",
    direction?: "row" | "row-reverse" | "column" | "column-reverse"
    className?: string
    rows?: string
    rowsAuto?: string
    columns?: string
    columnsAuto?:string
    width?: string
    height?: string
    maxHeight?: string
    background?: string
    overflow?: string
    radius?: string,
    style?: string,
    useArrowMovement?: boolean,
    ripplerEffect?: boolean,
    ripplerEffectColor?: string,
    id?: string,
    element?: HTMLDivElement
    variant?: "normal" | "border" | "shadow" | "border-color" |
        "border-modern" | "component-panel-border" | "component-panel-border-dark",

    onClick?: (event: MouseEvent) => void
    onMouseOver?: (isOver: boolean, event: MouseEvent) => void
    breakpoints?: Breakpoints
}


