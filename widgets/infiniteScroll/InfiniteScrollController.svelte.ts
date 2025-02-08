import type {ItemsBatch} from "./InfiniteScrollProps";

export class InfiniteScrollController {
    items: any[] = $state([])
    batches: ItemsBatch[] = $state([])
    batchId: number = $state(-1)
    isLoading: boolean = $state(false)
    isAllLoaded: boolean = $state(false)
    error: any = $state(undefined)
    onBatchRequested: (batchId: number) => Promise<any[]>;
    onError: (error: any) => void;

    constructor() {
        this.onBatchRequested = async (batchId: number) => []
        this.onError = (error: any) => {
        }
    }

    async requestNextBatch() {
        if (this.isAllLoaded)
            return

        this.isLoading = true;
        try {
            let batchResult = await this.onBatchRequested(this.batchId + 1);
            if (!this.isLoading)
                return

            this.batchId++;
            this.batches.push({
                id: this.batchId,
                items: batchResult
            })
            this.items = this.items.concat(batchResult);
        } catch (error) {
            this.error = error;
            this.onError(error)
        }
        this.isLoading = false;
    }

    clear() {
        this.items = [];
        this.batches = [];
        this.batchId = -1;
        this.isLoading = false;
        this.error = undefined
    }
}


export let useInfiniteScrollController = () => new InfiniteScrollController();

