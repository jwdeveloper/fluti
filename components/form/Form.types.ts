import type {Component} from "svelte";

export enum FormFieldType {
    custom, int, bool, text, date,
}

export interface FormField {
    property: string
    defaultValue: any
    name?: string
    type?: FormFieldType
    hint?: string
    template?: any
    required?: string,
    validator: {
        message: string
        pattern: string
    }
}

export interface FormWindow {
    isSaving: boolean

    fields: FormField[]

    gridTemplate: string

    addField(field: FormField): FormWindow

    onValidation(): void

    onSave(): void

    onCancel(): void
}


export interface FormProps {
    onSubmit?: () => Promise<any>,
    isSubmitting?: boolean,
    formData?: Record<string, any>
}


export enum ComponentType {

    input, combobox, range, checkbox
}

export interface FormItemProps extends FormItem {
    component?: Component
}

export interface FormItem {
    id: string,
    type?: ComponentType,
    label?: string,
    info?: string,
    error?: string,

    validation?: string
    data?: any
}
