import type {WindowHandle} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte";
import type {TableController} from "$lib/fluti/components/table/TableImpl.svelte";
import type {Component, Snippet} from "svelte";
import type {TableFetchRequest, TableFetchResponse, TableProps} from "$lib/fluti/components/table/Table";


export interface SupabaseFormProps {
    item: any;
    window: WindowHandle;
    table: TableController<any>;
    isEdit?: boolean;
}

export interface SearchTableEvent {
    input: string
    table: TableController<any>
    query: any,
}

export interface InterceptQueryTableEvent {
    table: TableController<any>
    query: any,
    item: any
}

export interface SupabaseTableProps extends TableProps {
    table: TableController<any>
    formTemplate?: Component<any>
    actionsTemplate?: Component<any> | Snippet | any
    headerTemplate?: Component<any> | Snippet | any
    formData?: any
    isOffline?: boolean,
    searchPlaceholder?: string

    onLoad?: (input: TableFetchRequest) => Promise<TableFetchResponse>
    onSearch?: (event: SearchTableEvent) => Promise<void>
    onAfterLoad?: (input: TableFetchResponse) => Promise<TableFetchResponse>
    onFormOpen?: () => any
    onIntercept?: (event: InterceptQueryTableEvent) => any

    enableSearch?: boolean
    enableInsert?: boolean
    enableUpdate?: boolean
    enableDelete?: boolean
    enableRefresh?: boolean
    enableColumnsSelect?: boolean
    enableItemsLimit?: boolean
    enablePagination?: boolean

    canEdit?: (item: any) => boolean
}
