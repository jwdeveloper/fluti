<script lang="ts">
    import type {DropdownProps} from "$lib/fluti/components/dropdown/dropdownTypes";
    import {onMount} from "svelte";

    let {
        placeholder = 'Select option',
        value = $bindable(undefined),
        item,
        items = $bindable([]),
        onUpdate = undefined,
        initIndex = -1,
        style = ''
    }: DropdownProps = $props();


    let init = false;

    $effect(() => {
        value
        if (!init) {
            init = true
            return
        }

        if (onUpdate && value)
            onUpdate(value)
    })

    onMount(() => {

        if (initIndex >= 0 && items.length > 0) {
            init = false
            value = items[initIndex].value;
        }

    })

</script>

<select bind:value={value} style={style}>
    <option disabled selected>{placeholder}</option>
    {#each items as item (item.value)}
        <option value={item.value}>{item.name}</option>
    {/each}
</select>


<style>

    select {
        background: var(--bg-primary);
        border: var(--border-size-medium) solid var(--bg-tertiary);
        width: 100%;
        color: var(--text-color);

        padding: var(--padding-medium) 1em;
        padding-right: 2.5em;
        border-radius: var(--radius-medium);

        width: 100%;
        padding: var(--padding-medium) 1em;
        padding-right: 2.5em;
        border-radius: var(--radius-medium);
        border: var(--border-size-medium) solid var(--bg-tertiary);
        color: var(--text-primary);
        font-size: var(--font-size-medium);
        transition: 100ms all ease-in;
    }

    option {
        padding: var(--padding);
    }


</style>


