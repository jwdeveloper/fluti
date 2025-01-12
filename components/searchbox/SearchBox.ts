import type {PanelProps} from "$lib/fluti/components/panel/Panel.type";

export type ComboboxItem =
    {
        text: string,
        value: any,
        subtitle?: string,
        hint?: string,
        icon?: string
        properties?: object
    }

export interface SearchBoxProps extends PanelProps {

}