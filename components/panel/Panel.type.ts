import type {Breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointType";

export interface PanelProps {
    panelType?: "flex" | "grid" | "block"
    gap?: string
    padding?: string
    justify?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | "",
    align?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | "",
    direction?: "row" | "row-isTopPort" | "column" | "column-isTopPort"

    shadow?: string,
    className?: string
    rows?: string
    columns?: string
    rowsAuto?: string
    columnsAuto?: string
    width?: string
    height?: string
    maxHeight?: string
    background?: string | 'primary' | 'secondary'
    overflow?: string
    radius?: string,
    border?: string
    style?: string,
    margin?: string,
    useArrowMovement?: boolean,
    ripplerEffect?: boolean,
    ripplerEffectColor?: string,
    useClickEffect?: boolean,
    id?: string,
    useStyles?: boolean,
    element?: HTMLDivElement
    tag?: string,
    variant?: "normal" | "border" | "shadow" | "border-color" |
        "border-modern" | "WebsocketPanel-panel-border" | "WebsocketPanel-panel-border-dark",

    onClick?: (event: MouseEvent) => void
    onMouseOver?: (isOver: boolean, event: MouseEvent) => void
    breakpoints?: Breakpoints

    sm?: PanelProps //props for small size
    md?: PanelProps //props for medium size
    lg?: PanelProps //props for large size
    xl?: PanelProps //props for large size

    hover?: PanelProps //props for hover

    children?: any
}


