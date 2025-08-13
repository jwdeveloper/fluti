import {
    type TableColumn,
    type TableControllerProps,
    type TableFetchResponse,
    TableItemAction,
    TableItemState,
    type TableQuery
} from "./Table";

export class TableController<T> {
    items: T[] = $state([])
    columns: TableColumn[] = $state([])
    displayedColumns: TableColumn[] = $derived.by(() => this.columns.filter(e => e.visible !== false))
    selected: T[] = $state([])
    itemsStates: TableItemState[] = []
    isLoading: boolean = $state(false)
    endpoint: string
    props: TableControllerProps
    query: TableQuery = $state({
        page: 1,
        pageSize: 1,
        limit: 10,
        search: '',
        filters: [],
        sorts: {}
    })

    constructor(props?: TableControllerProps) {

        if (props === undefined)
            props = {}


        if (props.items !== undefined) {
            // for(let item of props.items) {
            //     if(item.id === undefined)
            //         item.id = createRandomId()
            //         item.key = createRandomId()
            // }
            //  this.items = props.items
        }

        this.props = props;
        this.endpoint = this.props.endpoint ?? ''
        this.columns = this.props.columns ?? [];
    }

    async fetch() {
        this.isLoading = true;
        if (this.props.onFetch !== undefined) {
            let response = await this.props.onFetch({
                query: this.query,
                table: this,
                columns: this.columns
            })
            if (response.error) {
                console.log(response.error)
                response.data = [];
            }
            this.items = response.data
            this.selected = []
            this.itemsStates = []
        }
        this.isLoading = false;
    }


    async deleteAsync(item: T): Promise<TableFetchResponse> {
        this.isLoading = true;
        let result = {
            error: '',
            data: []
        }
        if (this.props.onDelete) {
            //@ts-ignore
            result = await this.props.onDelete(item) as TableFetchResponse
        }
        this.isLoading = false;
        return result;
    }


    delete(item: T) {
        this.isLoading = true;
        try {
            // Remove the item from the items list
            //@ts-ignore
            this.items = this.items.filter(existingItem => existingItem['id'] !== item['id']);
            //@ts-ignore
            this.selected = this.selected.filter(existingItem => existingItem['id'] !== item['id'])
            this.itemsStates = [
            //@ts-ignore
                ...this.itemsStates.filter(state => state.item.id !== item.id), // Remove old state
                {
                    item,
                    action: TableItemAction.Delete
                }
            ];
        } finally {
            this.isLoading = false;
        }
    }

    async updateAsync(item: T) {
        this.isLoading = true;
        let result = {
            error: '',
            data: []
        }
        if (this.props.onUpdate) {
            //@ts-ignore
            result = await this.props.onUpdate(item) as TableFetchResponse
        }
        this.isLoading = false;
        return result;
    }

    async insertAsync(item: T) {
        this.isLoading = true;
        let result = {
            error: '',
            data: []
        }
        if (this.props.onInsert) {
            //@ts-ignore
            result = await this.props.onInsert(item) as TableFetchResponse
        }
        this.isLoading = false;
        return result;
    }
}

function createRandomId() {
    return Math.random().toString(36).substring(7);
}


export const useTable = <T>(props?: TableControllerProps) => {
    return new TableController<T>(props);
}