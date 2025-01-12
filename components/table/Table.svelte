<script lang="ts">
    import type {TableProps} from "./Table";
    import Loader from "$lib/fluti/components/loader/Loader.svelte";
    import TableColumnHeader from "./TableColumnHeader.svelte";
    import Panel from "$lib/fluti/components/panel/Panel.svelte";

    let {table}: TableProps = $props();

    const handleUpdateCheckValue = (item: any, value: boolean) => {

        let current = isSelected(item)
        if (current === value) {
            value = !value;
        }

        if (value) {
            table.selected.push(item);
        } else {
            const index = table.selected.findIndex(selectedItem => selectedItem.id === item.id);
            if (index !== -1) table.selected.splice(index, 1);
        }
    }

    const handleSelect = (item: any, mouseEvent: MouseEvent) => {
        handleUpdateCheckValue(item, !isSelected(item))
    }

    const isSelected = (item: any): boolean => {
        const index = table.selected.findIndex(selectedItem => selectedItem.id === item.id);
        return index !== -1;
    }

    const getItemValue = (item: any, path: string): any => {
        return path.split('.').reduce((acc, key) => {
            if (acc && typeof acc === 'object') {
                return acc[key];
            }
            return undefined;
        }, item);
    }

    function snippetOrComponent(obj) {
        if (typeof obj !== 'function') {
            return "unknown";
        }

        if (obj.prototype) {
            return "component"
        }
        return 'snippet';
    }


</script>
<div class="table-container">
    <Loader bind:isLoading={table.isLoading}/>
    <table>
        <thead class="thead-container">
        <tr>
            {#each table.displayedColumns as column (column.key)}
                <th style={`width: ${column.width || 'max-content'};`}>
                    {#if column.headerTemplate}
                        {#if snippetOrComponent(column.headerTemplate) === 'snippet'}
                            {@render column.headerTemplate(column, table)}
                        {:else}
                            <svelte:component this={column.headerTemplate} table={table} column={column}/>
                        {/if}
                    {:else}
                        <TableColumnHeader table={table} column={column}/>
                    {/if}
                </th>
            {/each}
        </tr>
        </thead>
    </table>
    <div class="tbody-container">
        <table>
            <tbody>
            {#each table.items as item (item.id)}
                <tr onclick={(e)=>handleSelect(item,e)}>
                    {#each table.displayedColumns as column (column.key)}
                        <td style={`width: ${column.width || 'max-content'};`}>
                            {#if column.rowTemplate}
                                {#if snippetOrComponent(column.rowTemplate) === 'snippet'}
                                    {@render column.rowTemplate(item)}
                                {:else}
                                    <svelte:component this={column.rowTemplate} item={item}/>
                                {/if}
                            {:else}
                                <Panel justify="flex-start" padding="0em 1em">
                                    {getItemValue(item, column.key)}
                                </Panel>
                            {/if}
                        </td>
                    {/each}
                </tr>
                {#if table?.props?.rowTemplate && isSelected(item)}
                    <tr>
                        <td colspan={table.displayedColumns.length}>
                            {#if snippetOrComponent(table?.props?.rowTemplate) === 'snippet'}
                                {@render table?.props?.rowTemplate.rowTemplate(item)}
                            {:else}
                                <svelte:component this={table?.props?.rowTemplate} item={item}/>
                            {/if}
                        </td>
                    </tr>
                {/if}
            {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .table-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .thead-container {
        overflow: visible;
        background-color: var(--bg-200); /* Ensure background matches design */

    }

    .tbody-container {
        flex-grow: 1;
        overflow-y: scroll;
        scrollbar-width: thin;
        scrollbar-color: var(--bg-accent) var(--bg-400);
        height: 100%;

    }

    table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;

    }

    th, td {
        text-align: left;
        border-bottom: 1px solid var(--color-ligher); /* Add border to cells */

    }

    td{
        /*background: red;*/
    }

    th {
        padding: 0.5em 0;

    }

    thead {
        position: sticky;
        top: 0;
        z-index: 5;

    }

    tr:hover {
        background: var(--bg-000);
        /*cursor: pointer;*/

    }

    th {
        background-color: var(--bg-200); /* Sticky header background */

    }
</style>
