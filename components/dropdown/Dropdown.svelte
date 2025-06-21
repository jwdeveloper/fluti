<script lang="ts">
    import type {DropdownProps} from "$lib/fluti/components/dropdown/dropdownTypes";
    import {onMount} from "svelte";

    let {
        placeholder = 'Wybierz opcje',
        value = $bindable(''),
        items = $bindable([]),
        onUpdate = undefined,
        style = ''
    }: DropdownProps = $props();


    $effect(() => {
        value
        if (onUpdate)
            onUpdate(value)
    })

    $effect(() => {
        items
        if (items.length === 0)
            return
        if (!items.find(e => e.value === value)) {
            value = items[0].value;
        }

    })

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
        value = items[0].value;
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


