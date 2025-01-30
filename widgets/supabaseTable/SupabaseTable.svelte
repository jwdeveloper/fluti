<script lang="ts">
    import Table from "$lib/fluti/components/table/Table.svelte";

    import {supabase} from "$lib/supabase-client";
    import {SortState, type TableFetchRequest, type TableFetchResponse} from "$lib/fluti/components/table/Table";
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import {useAlert} from "$lib/fluti/widgets/alert/AlertImpl.svelte";
    import {scale as effectTrans} from "svelte/transition";
    import {useWindow, WindowCloseReason, WindowHandle} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte";
    import SupabaseForm from "./SupabaseForm.svelte";
    import type {SupabaseTableProps} from "./SupabaseComponentTypes";
    import QuestionWindow from "$lib/fluti/pages/questionWindow/QuestionWindow.svelte";
    import Input from "$lib/fluti/components/input/Input.svelte";
    import SearchBox from "$lib/fluti/components/searchbox/SearchBox.svelte";
    import Checkbox from "$lib/fluti/components/checkbox/Checkbox.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import SupabaseTablePagination from "./SupabaseTablePagination.svelte";


    const supabaseClient = (useViewName: boolean = false) => {
        let schema = table.props?.schema ?? "public"
        let tableName = table.props.name;
        if (useViewName)
            tableName = table.props.viewName ? table.props.viewName : table.props.name;

        if (!tableName)
            throw new Error('Table name is not defined')

        //@ts-ignore
        return supabase.schema(schema).from(tableName);
    }

    const handleLoad = async (event: TableFetchRequest): Promise<TableFetchResponse> => {
        event.query.search = tableQuery.search;
        if (isOffline)
            return {
                error: '',
                data: table.items
            }

        if (onLoad) {
            return await onLoad(event)
        }

        let query = supabaseClient(true).select('*', {
            count: 'exact'
        });
        if (onIntercept) {
            query = onIntercept({
                item: undefined,
                query: query,
                table: table
            })
        }
        for (let filter of event.query.filters) {
            if (filter.operator === '=')
                query = query.eq(filter.key, filter.value);
        }
        if (onSearch) {
            let event = {
                input: tableQuery.search,
                table: table,
                query: query
            }
            // @ts-ignore
            await onSearch(event)
        }

        for (let item in event.query.sorts) {
            let filter = event.query.sorts[item];
            if (filter.value === SortState.None)
                continue

            let asc = filter.value === SortState.Asc;
            query = query.not(filter.key, 'is', null);
            query = query.order(filter.key, {ascending: asc});
        }
        query = query.order('id', {ascending: false});

        let rangeFrom = (table.query.page - 1) * table.query.limit;
        let rangeTo = table.query.page * table.query.limit - 1;
        query = query.range(rangeFrom, rangeTo);

        let result = await query;
        if (result.count)
            table.query.pageSize = Math.ceil(result.count / table.query.limit);

        if (result.error) {
            alerts.pushAlert(result.error + "")
        }

        if (onAfterLoad) {
            result = await onAfterLoad(result)
        }

        return result as TableFetchResponse;
    }

    const handleDelete = async (item: any): Promise<TableFetchResponse> => {
        console.log(item.id)
        let query = supabaseClient().delete().eq('id', item.id);
        if (onIntercept) {
            query = onIntercept({
                item: item,
                query: query,
                table: table
            })
        }

        let result = await query;
        if (result.error) {
            console.log(result)
            alerts.pushAlert(result.error.message + "", '', 5000)
        }
        // @ts-ignore
        return result as TableFetchResponse;
    }

    const handleInsert = async (item: any): Promise<TableFetchResponse> => {
        let insertData = {...item};
        delete insertData.formData;

        let query = supabaseClient().insert(insertData);
        if (onIntercept) {
            query = onIntercept({
                item: insertData,
                query: query,
                table: table
            })
        }
        let result = await query;

        if (result.error) {
            alerts.pushAlert(result.error.message + "", '', 5000)
        }

        // @ts-ignore
        return result as TableFetchResponse;
    }


    const handleUpdate = async (item: any): Promise<TableFetchResponse> => {
        let query = supabaseClient()
            .update(item)
            .eq('id', item.id);

        if (onIntercept) {
            query = onIntercept({
                item: item,
                query: query,
                table: table
            })
        }
        let result = await query;
        if (result.error) {
            alerts.pushAlert(result.error.message + "", '', 5000)
        }
        // @ts-ignore
        return result as TableFetchResponse;
    }

    const onEditClick = async (item: any) => {
        let result = await form.open({
            item: {...item, formData: {...formData}},
            table: table,
            isEdit: true
        })
        if (result.closeReason !== WindowCloseReason.save)
            return
        await table.fetch();
        alerts.pushAlert("Pomyślnie zaktualizowano", '', 1000)
    }

    const onInsertClick = async () => {
        let result = await form.open({
            item: {formData: {...formData}},
            table: table,
            isEdit: false
        })
        if (result.closeReason !== WindowCloseReason.save)
            return

        await table.fetch();
        alerts.pushAlert("Pomyślnie dodano", '', 1000)
    }

    const isSelected = (item: any): boolean => {
        const index = table.selected.findIndex(selectedItem => selectedItem.id === item.id);
        return index !== -1;
    }


    const onDeleteMany = async (event: any) => {
        if (isOffline)
            return

        const result = await questionWindow.open({message: `Czy napewno chcesz usunąć ${table.selected.length} elementów?`})
        if (result.closeReason !== WindowCloseReason.save)
            return

        for (let item of table.selected) {
            await table.deleteAsync(item);
        }
        await table.fetch();
    }

    const {
        table = $bindable(),
        formTemplate,
        headerTemplate,
        actionsTemplate,
        formData = $bindable({}),
        onSearch,
        onIntercept,
        onAfterLoad,
        onLoad,
        searchPlaceholder = 'Search',
        isOffline = false,
        enableSearch = false,
        enableInsert = true,
        enableUpdate = true,
        enableDelete = true,
        enableRefresh = true,
        enablePagination = true,
        enableColumnsSelect = true,
        enableItemsLimit = true,

        canEdit = () => true,
    }: SupabaseTableProps = $props();
    const alerts = useAlert();
    const questionWindow = useWindow(QuestionWindow);
    const form: WindowHandle = useWindow(formTemplate ?? SupabaseForm)
    const showInsert = $derived.by(() => table.selected.length === 0);
    const tableQuery = $state({
        search: '',
        limit: {
            text: table.query.limit ?? "10",
            value: table.query.limit ?? "10"
        }
    });
    const columnsSelect = $derived.by(() => {
        return table.columns.filter(e => e.text !== '').map(e => {
            return {text: e.text, value: e.key}
        })
    })

    const limits = [{
        text: '5',
        value: 5
    }, {
        text: '10',
        value: 10
    }, {
        text: '20',
        value: 20
    }, {
        text: '50',
        value: 50
    }, {
        text: '100',
        value: 100
    }];
    let selectAll = $state(false)

    let selectedColumns = $derived.by(() => {
        let obj = {}
        for (let item of table.displayedColumns) {
            obj[item.key] = item.text
        }
        return obj;
    })

    $effect(() => {
        if (selectAll)
            table.selected = [...table.items]
        else
            table.selected = []
    })

    $effect(() => {
        tableQuery.search
        if (!onSearch)
            return

        if (!table.isLoading)
            return;
    })


    $effect(() => {
        table.query.limit = tableQuery.limit.value
        table.fetch();
    })

    $effect(() => {
        table.props.onFetch = handleLoad;
        table.props.onDelete = handleDelete;
        table.props.onInsert = handleInsert;
        table.props.onUpdate = handleUpdate;
        if (table.columns.filter(e => e.key === 'table_actions').length === 0) {
            table.columns = [
                {
                    key: 'table_actions',
                    text: '',
                    form: false,
                    width: "100px",
                    headerTemplate: HeaderTemplateSnippet,
                    rowTemplate: TableCrudActions
                },
                ...
                    table.columns
            ]
            return
        }
        tableQuery.limit = {
            text: table.query.limit ?? "10",
            value: table.query.limit ?? 10
        }
        table.fetch();
    })


    const handleSelectColumn = (e) => {
        for (let column of table.columns) {
            if (column.key === e.value) {
                column.visible = true
                break;
            }
        }
    }
    const handleUnselectColumn = (e) => {
        for (let column of table.columns) {
            if (column.key === e.value) {
                column.visible = false
                break;
            }
        }
    }
</script>

{#snippet HeaderTemplateSnippet()}
    <Panel direction="row" justify="flex-start" width="auto">
        <Checkbox bind:value={selectAll}/>

    </Panel>
{/snippet}

{#snippet SelectedTablesTemplate()}
    <div>
        Kolumny ({table.displayedColumns.length})
    </div>
{/snippet}

{#snippet TableCrudActions(item)}
    <Panel direction="row" justify="flex-start" width="auto">
        <Checkbox value={isSelected(item)}/>
        {#if enableUpdate && canEdit(item)}
            <Hint title="Edytuj">

                <!--            <Button onClick={()=>onEditClick(item)}-->
                <!--                    size="btn-small"-->
                <!--                    icon="fa fa-pencil"-->
                <!--            />-->
                <Icon icon="fa fa-pencil" onClick={()=>onEditClick(item)}/>
            </Hint>

        {/if}
        {#if actionsTemplate}
            {@render actionsTemplate(item)}
        {/if}
    </Panel>
{/snippet}

<Panel direction="column"
       width="100%"
       height="100%"
       maxHeight="100%"
       overflow="hidden"
       justify="flex-start"
       rows="auto 1fr"
       padding="0"
       gap="0"
       align="flex-start">


    <Panel width="100%" panelType="grid" columns="repeat(auto-fit,minmax(0,1fr))" padding="0" style="z-index: 10">
        <Panel gap="0.5em" width="100%"
               padding="0.5em 0"
               justify="flex-start">
            {#if headerTemplate}
                {@render headerTemplate()}
            {/if}

            {#if enableRefresh}
                <!--                <Button size="btn-small"-->
                <!--                        onClick={()=> table.fetch()}-->
                <!--                        disabled={table.isLoading}-->
                <!--                        icon="fa fa-refresh"-->
                <!--                        variant="btn-filled"/>-->
                <Hint title="odśwież">
                    <Icon icon="fa fa-refresh"
                          disabled={table.isLoading}
                          onClick={()=> table.fetch()}/>
                </Hint>
            {/if}
            {#if enableInsert}
                <Hint title="Utwórz nowy wpis">
                    <Icon icon="fa fa-plus"
                          disabled={table.isLoading}
                          onClick={onInsertClick}>
                        Utwórz
                    </Icon>
                </Hint>
            {/if}
            {#if !showInsert && enableDelete}
                <div transition:effectTrans>
                    <Hint title="Usuń">
                        <Icon icon="fa fa-trash"
                              disabled={table.isLoading}
                              onClick={onDeleteMany}>
                            ({table.selected.length})
                        </Icon>
                    </Hint>
                </div>
            {/if}

        </Panel>
        {#if enableSearch}
            <Panel width="100%" padding="0">

                <Input placeholder={searchPlaceholder}
                       bind:value={tableQuery.search}
                       icon="fa fa-search"/>
            </Panel>
        {/if}
        <Panel width="100%" justify="flex-end" padding="0">

            {#if enableColumnsSelect}
                <Hint title="Widoczne kolumny">
                    <SearchBox
                            multiSelect={true}
                            items={columnsSelect}
                            selected={selectedColumns}
                            onDelete={handleUnselectColumn}
                            onSelect={handleSelectColumn}
                            placeholderTemplate={SelectedTablesTemplate}
                            placeholder="Kolumny"/>
                </Hint>
            {/if}
        </Panel>
    </Panel>
    <div style="height: 100%; overflow-y: hidden; border-radius: var(--radius-medium)">
        <Table table={table}/>
    </div>

    <Panel justify="flex-end" width="100%" gap="1em" padding="0" style="z-index: 10">
        <Panel padding="0">
            {#if enableItemsLimit}
                <Hint title="Wyników na stronie:">
                    <SearchBox enableSearch={false}
                               bind:value={tableQuery.limit}
                               items={limits}
                               placeholder="Ilość (10)"/>
                </Hint>
            {/if}

            {#if enablePagination}
                <SupabaseTablePagination table={table}/>
            {/if}
        </Panel>
    </Panel>

</Panel>



