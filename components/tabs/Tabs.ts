import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

export interface TabsProps extends ElementProps {

    items: TabsItem[],

    selectedItem?: TabsItem | undefined

    selectedComponent?: any | undefined
}

export interface TabsItem {
    key?: string
    name: string
    icon?: string,
    component?: any,
    onClick?: (tabItem: TabsItem) => void
}