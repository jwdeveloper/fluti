export interface ElementStyleProps {
    className?: string
    background?: string
    color?: string
    gap?: string
    height?: string
    width?: string
    rows?: string
    columns?: string
    padding?: string
    radius?: string
    fontSize?: string
    margin?: string
    display?: "flex" | "grid" | "block" | 'none'
    justify?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | "",
    align?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | "",
    direction?: "row" | "row-reverse" | "column" | "column-reverse"
    style?: string

    hover?: ElementStyleProps
}

export interface ElementEffectsProps {

    rippler?: {
        color?: string
    }

    click?: {
        animation?: string
    }

}


export interface ElementProps extends ElementStyleProps {
    id?: string
    tag?: string
    element?: HTMLHtmlElement
    children?: any
    effects?: ElementEffectsProps

    onClick?: (e: any) => void
    attributes?: any //other element properties

    mobile?: ElementStyleProps
    tablet?: ElementStyleProps
    desktop?: ElementStyleProps
}


const styleMap = {
    panelType: "display",
    background: "background",
    width: "width",
    height: "height",
    radius: "border-radius",
    padding: "padding",
    margin: "margin",
    direction: "flex-direction",
    align: "align-items",
    justify: "justify-content",
    columns: "grid-template-columns",
    rows: "grid-template-rows",
    gap: "gap",
    shadow: "box-shadow",
    border: "border",
    fontSize: "font-size",
};


export function getClassName(id?: string) {
    const classId = `${Math.random().toString(36).substr(2, 9).replace(" ", '')}`;
    const className = id ?? `element-${classId}`
    return className
}

export let createCssClass = (rootElement: ElementProps, className: string, isHover: boolean) => {
    const mainContent = createCssContent(rootElement?.hover);
    let mobileContent = ''
    if (rootElement?.mobile?.hover) {
        mobileContent = `
        @media (max-width: 600px) {
         ${createCssContent(rootElement?.mobile?.hover)}
        }`
    }

    let tableContent = ''
    if (rootElement?.tablet?.hover) {
        tableContent = `
        @media (max-width: 900px) {
         ${createCssContent(rootElement?.tablet?.hover)}
        }`
    }

    return `.${className}${isHover ? ':hover' : ''} { ${mainContent} ${mobileContent} ${tableContent} }`
}


let createCssContent = (classData: any) => {
    let styles = Object.entries(classData)
        //@ts-ignore
        .filter(([key, value]) => value !== undefined && value !== '' && styleMap[key])
        //@ts-ignore
        .map(([key, value]) => `${styleMap[key]}: ${value} !important;`)
        .join(' ')
    if (classData.style) {
        styles += ` ${classData.style}`;
    }
    return styles;
}