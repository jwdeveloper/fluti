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
        showError = false,
        style = ''
    }: DropdownProps = $props();

    let init = $state(false);
    let open = $state(false);
    let search = $state("")
    let filteredItems = $state(items);

    $effect(() => {
        filteredItems = items.filter((i) =>
            i.name.toLowerCase().includes(search.toLowerCase())
        );
    });

    $effect(() => {
        if (!init) {
            init = true;
            return;
        }
        if (onUpdate && value) onUpdate(value);
    });

    onMount(() => {
        if (initIndex >= 0 && items.length > 0) {
            init = false;
            value = items[initIndex].value;
        }
    });

    function selectItem(val: string) {
        value = val;
        open = false;
    }
</script>

<div class="dropdown"
     style={style}>
    <div
            class:dropdown-error={showError}
            class="dropdown-header" on:click={() => (open = !open)}>
        {#if value}
            {items.find(i => i.value === value)?.name}
        {:else}
            <span class:placeholder>{placeholder}</span>
        {/if}
    </div>

    {#if open}
        <div

                class="dropdown-menu">
            <input
                    type="text"
                    placeholder="Wyszukaj..."
                    bind:value={search}
                    class="search-input"
            />

            {#each filteredItems as item (item.value)}
                <div
                        class="dropdown-item"
                        on:click={() => selectItem(item.value)}
                >
                    {item.name}
                </div>
            {/each}

            {#if filteredItems.length === 0}
                <div class="dropdown-empty">Brak wyników</div>
            {/if}
        </div>
    {/if}
</div>

<style>

    .dropdown-error {
        border-color: var(--text-error) !important;
        background:  color-mix(in srgb, var(--text-error) 10%, var(--bg-primary) 20%) !important;
    }

    .dropdown {
        position: relative;
        width: 100%;
    }

    .dropdown-header {
        background: var(--bg-primary);
        border: var(--border-size-medium) solid var(--bg-tertiary);
        padding: var(--padding-medium) 1em;
        border-radius: var(--radius-medium);
        color: var(--text-primary);
        cursor: pointer;
        transition: all 200ms ease-out;
    }

    .dropdown-header .placeholder {
        color: var(--text-secondary);
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        border: var(--border-size-medium) solid var(--bg-tertiary);
        border-radius: var(--radius-medium);
        margin-top: 0.3em;
        max-height: 200px;
        overflow-y: auto;
        z-index: 100;

    }

    .search-input {
        width: 100%;
        padding: var(--padding-small);
        border: none;
        border-bottom: 1px solid var(--bg-tertiary);
        background: var(--bg-secondary);
        color: var(--text-primary);
        outline: none;
    }

    .dropdown-item {
        padding: var(--padding-small) 1em;
        cursor: pointer;
        transition: background 0.2s;
    }

    .dropdown-item:hover {
        background: var(--bg-tertiary);
    }

    .dropdown-empty {
        padding: var(--padding-small) 1em;
        color: var(--text-secondary);
        font-style: italic;
    }
</style>