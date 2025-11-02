import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

//@ts-ignore
export interface TabsProps extends ElementProps {

    items: TabsItem[],

    selectedItem?: TabsItem | undefined

    selectedComponent?: any | undefined

    onClick?: (tabItem: TabsItem, event: MouseEvent | KeyboardEvent | undefined) => void

    padding?: string
}

export interface TabsItem {
    key?: string
    name: string
    icon?: string,
    component?: any,
    onClick?: (tabItem: TabsItem, event: MouseEvent | KeyboardEvent | undefined) => void
}