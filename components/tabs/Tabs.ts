export interface TabsProps {

    items: TabsItem[],

    selectedItem?: TabsItem | undefined

    selectedComponent?: any | undefined
}

export interface TabsItem {
    name: string
    icon?: string,
    component?: any,
}