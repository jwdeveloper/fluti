<script lang="ts">

    import {SortState, type TableColumnHeaderProps} from "./Table";
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Button from "$lib/fluti/components/button/Button.svelte";

    let {table, column}: TableColumnHeaderProps = $props();
    let state = $state(SortState.None);

    let icon = $derived.by(() => {
        if (!column.enableSort) {
            return undefined;
        }
        switch (state) {
            case SortState.None:
                return 'fa fa-solid fa-sort'
            case SortState.Asc:
                return 'fa fa-solid fa-sort-up'
            case SortState.Desc:
                return 'fa fa-solid fa-sort-down'
        }
    })
    const handleClick = (event: MouseEvent) => {
        if (!column.enableSort) {
            return;
        }
        switch (state) {
            case SortState.None:
                state = SortState.Asc;
                break;
            case SortState.Asc:
                state = SortState.Desc;
                break;
            case SortState.Desc:
                state = SortState.None;
                break;
        }

        if (state === SortState.None) {
            delete table.query.sorts[column.key];
            table.fetch();
            return;
        }

        table.query.sorts[column.key] = {
            key: column.key,
            operator: state,
            value: state
        }
        table.fetch();
    }
</script>


<Panel panelType="flex" justify="flex-start"
       padding="0"
       columns="1fr 1fr"
       gap="0.5em">
    <Button onClick={handleClick} size="btn-small" icon={icon} style="color: var(--color)">
        {column.text}
    </Button>
</Panel>


<style>
    th {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        background-color: #f4f4f4;
    }


</style>
