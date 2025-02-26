import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
import type {PaginationController} from "$lib/fluti/widgets/pagination/PaginationController.svelte";


export type PaginationPosition = 'top' | 'bottom' | 'both'

export interface PaginationProps extends ElementProps {
    controller: PaginationController
    paginationPosition?: PaginationPosition

    loadingTemplate?: any,
    paginationTemplate?: any
    itemTemplate?: any
    noItemsTemplate?: any
    errorTemplate?: any

    translations?: {
        previous?: string
        next?: string
        open?: string
        goToLast?: string
    }
}

export interface PaginationControllerProps {
    pageInfo: PaginationPageInfo
    items: any[]
    isLoading: boolean,
    serverSide: boolean
    onPageSelected?: (ctx: PaginationController) => Promise<void>
}

export interface PaginationPageInfo {
    totalPages: number
    itemsPerPage: number
    page: number
}