import type {TableController} from "./TableImpl.svelte.js";
import type {Component, Snippet} from "svelte";


export interface TableColumnHeaderProps {
    column: TableColumn
    table: TableController<any>
}

export interface TableQuery {
    page: number,
    pageSize: number,
    limit: number,
    search: string,
    filters: TableQueryExpression[]
    sorts: Record<string, TableQueryExpression>
}

export interface TableQueryExpression {
    key: string
    value: any
    operator: any
}

export enum SortState {
    None,
    Asc,
    Desc,
}

export interface TableControllerProps {
    endpoint?: string
    columns?: TableColumn[]
    name?: string
    schema?: string
    viewName?: string,
    items?: any
    onFetch?: (items: TableFetchRequest) => Promise<TableFetchResponse>
    onDelete?: (items: any) => Promise<TableFetchResponse>
    onInsert?: (items: any) => Promise<TableFetchResponse>
    onUpdate?: (items: any) => Promise<TableFetchResponse>
    rowTemplate?: Snippet | any

}

export interface InterceptEvent {
    supabaseQuery: any
}

export interface TableFetchRequest {
    query: TableQuery,
    table: TableController<any>
    columns: TableColumn[]
}


export interface TableFetchResponse {
    error?: string | any,
    data: any[]
}

export enum TableItemAction {
    None,
    Insert,
    Update,
    Delete
}

export class TableItemState {
    item: any
    action: TableItemAction = TableItemAction.None
}


export interface TableItem<T> {
    element: HTMLHtmlElement,
    item: T
}

export interface TableProps {
    className?: string
    table: TableController<any>
    id?: string
}

export interface TableColumn {
    text?: string
    key: string
    width?: string
    hint?: string
    align?: 'left' | 'center' | 'right'
    sortable?: boolean
    enableSort?: boolean
    sort?: 'asc' | 'desc',
    visible?: boolean
    index?: number
    rowTemplate?: Snippet | any
    headerTemplate?: Snippet | any
    form?: boolean
    data?: any
}