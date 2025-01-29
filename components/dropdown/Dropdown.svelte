<script lang="ts">
    import type {DropdownProps} from "$lib/fluti/components/dropdown/dropdownTypes";
    import {onMount} from "svelte";
    import InputPanel from "$lib/fluti/components/panel/InputPanel.svelte";
    import Input from "$lib/fluti/components/input/Input.svelte";

    let {
        placeholder = 'Wybierz opcje',
        value = $bindable(''),
        items = $bindable([])
    }: DropdownProps = $props();

    onMount(() => {
        if (items.length === 0)
            return
        let item = items[0];
        if (typeof item === 'string') {
            items = items.map(e => {
                return {
                    name: e as string,
                    value: e as string
                }
            })
        }


    })

</script>

<select bind:value={value}>
    <option disabled selected>{placeholder}</option>
    {#each items as item (item.name)}
        <option value={item.value}>{item.name}</option>
    {/each}
</select>


<style>

    select {
        background: var(--bg-secondary);
        padding: var(--padding);
        border: var(--border-size) solid var(--text-muted);
        border-radius: var(--radius-medium);
        width: 100%;
    }

    option {
        padding: var(--padding);
    }


</style>


