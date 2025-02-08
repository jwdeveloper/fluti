import type {InfiniteScrollController} from "./InfiniteScrollController.svelte.js";
import type {PanelProps} from "$lib/fluti/components/panel/Panel.type";

export interface ItemsBatch {
    items: any[],
    id: number
}

export interface InfiniteScrollProps {

    controller?: InfiniteScrollController

    itemTemplate?: any

    loadingTemplate?: any

    errorTemplate?: any

    threshold?: number

    batches?: ItemsBatch[]

    onBatchRequested?: (index: number) => {};

    onBatchLoaded?: (items: any[], index: number) => {};

    container?: PanelProps
}