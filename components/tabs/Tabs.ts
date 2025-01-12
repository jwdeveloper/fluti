export interface TabsProps {

    items: TabsItem[],

    selectedItem: TabsItem | undefined

    onSelect(event: (item: TabsItem) => void): void
}


export interface TabsItem {
    name: string
    value: any
    icon: string,
}