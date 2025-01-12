
export interface CheckboxProps
{
    id?:string
    value: boolean
    onUpdate?: (value: boolean, id: string) => void
}