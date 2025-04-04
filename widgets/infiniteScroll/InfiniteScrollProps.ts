import type {InfiniteScrollController} from "./InfiniteScrollController.svelte.js";
import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

export interface ItemsBatch {
    items: any[],
    id: number
}

export interface InfiniteScrollProps {

    controller?: InfiniteScrollController

    itemTemplate?: any

    loadingTemplate?: any

    errorTemplate?: any

    noResultsTemplate?: any

    threshold?: number

    batches?: ItemsBatch[]

    onBatchRequested?: (index: number) => {};

    onBatchLoaded?: (items: any[], index: number) => {};

    container?: ElementProps
}