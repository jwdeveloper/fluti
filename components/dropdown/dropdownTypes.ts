export interface DropdownItem {
    name: string,
    value: any
}

export interface DropdownProps {
    value: string
    items: string[] | DropdownItem[]
    placeholder?: string
}