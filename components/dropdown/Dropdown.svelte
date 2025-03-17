<script lang="ts">
    import type {DropdownProps} from "$lib/fluti/components/dropdown/dropdownTypes";
    import {onMount} from "svelte";
    import InputPanel from "$lib/fluti/components/panel/InputPanel.svelte";
    import Input from "$lib/fluti/components/input/Input.svelte";

    let {
        placeholder = 'Wybierz opcje',
        value = $bindable(''),
        items = $bindable([]),
        style = ''
    }: DropdownProps = $props();


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
        padding: var(--padding);
        border: var(--border-size-medium) solid var(--bg-tertiary);
        border-radius: var(--radius-medium);
        width: 100%;
        color: var(--text-color);
    }

    option {
        padding: var(--padding);
    }


</style>


