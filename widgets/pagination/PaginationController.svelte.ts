import type {PaginationControllerProps, PaginationPageInfo} from "$lib/fluti/widgets/pagination/PaginationProps";

export class PaginationController {

    items: any[] = $state([])
    //@ts-ignore
    pageInfo: PaginationPageInfo = $state()
    isLoading: boolean = $state(false)

    _props: PaginationControllerProps

    constructor(props: PaginationControllerProps) {
        this._props = props;
        this.pageInfo = props.pageInfo;
        this.items = props.items;
        this.isLoading = this.items?.length === 0 ? true : props.isLoading
    }

}

export function usePaginationController(props?: PaginationControllerProps) {

    if (!props) {
        props = {
            pageInfo: {totalPages: 1, page: 1, itemsPerPage: 10, count: 0},
            items: [],
            isLoading: true,
            serverSide: true
        }
    }

    return new PaginationController(props);
}