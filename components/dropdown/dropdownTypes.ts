export interface DropdownItem {
    name: string,
    value: any
}

export interface DropdownProps {
    style?: string
    value: string | number
    items: string[] | DropdownItem[]
    placeholder?: string
}