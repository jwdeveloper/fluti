export interface TabsProps {

    items: TabsItem[],

    selectedItem?: TabsItem | undefined

    selectedComponent?: any | undefined

    initialWidth?:string
}

export interface TabsItem {
    name: string
    icon?: string,
    component?: any,
}