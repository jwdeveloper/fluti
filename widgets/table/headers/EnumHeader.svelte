<script lang="ts">
    import type {TableColumnHeaderProps} from "$lib/fluti/components/table/Table";
    import SearchBox from "$lib/fluti/components/searchbox/SearchBox.svelte";

    let {table, column}: TableColumnHeaderProps = $props();
    let selectedItem = $state({text: undefined, value: undefined})

    if (column?.data?.items) {
        column.data.items = [{
            text: column.data.placeholder + " (*)",
            value: '*'
        }, ...column.data.items]
    }

    $effect(() => {
        selectedItem
        if (selectedItem.value === undefined)
            return
        if (selectedItem.value === "*") {
            table.query.filters = table.query.filters.filter(filter => filter.key !== column.key)
            table.fetch();
            return
        }

        table.query.filters.push({
            key: column.key,
            value: selectedItem.value,
            operator: "="
        })

        table.fetch();
    })
</script>

<SearchBox bind:value={selectedItem}
           bind:items={column.data.items}
           placeholder="status"/>

<style>
</style>
