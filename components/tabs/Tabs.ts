import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

export interface TabsProps extends ElementProps{

    items: TabsItem[],

    selectedItem?: TabsItem | undefined

    selectedComponent?: any | undefined

    initialWidth?: string
}

export interface TabsItem {
    name: string
    icon?: string,
    component?: any,
}