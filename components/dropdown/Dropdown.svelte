<script lang="ts">
    import type {DropdownItem, DropdownProps} from "$lib/fluti/components/dropdown/dropdownTypes";
    import {onMount} from "svelte";
    import {wait} from "$lib/fluti/utils/Wait";

    let {
        placeholder = 'Select option',
        value = $bindable(undefined),
        item,
        items = $bindable([]),
        onUpdate = undefined,
        initIndex = -1,
        showError = false,
        showIcon = false,
        style = '',
        filter,
    }: DropdownProps = $props();

    let init = $state(false);
    let open = $state(false);
    let search = $state("")
    let filteredItems = $state(items);

    $effect(() => {
        filteredItems = items.filter((i: DropdownItem) => {
            if (filter) {
                return filter(i, search)
            }
            return i.name.toLowerCase().includes(search.toLowerCase())
        });
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
        open = false;

        wait(10).then(e => {
            value = val;
            open = false;
        })
    }

    let inputEl: HTMLInputElement | null = $state(null);

    // $effect(() => {
    //     open
    //     if (open && inputEl)
    //         inputEl.focus()
    // })

    let highlightedIndex = $state(0)

    function handleKeyDown(event: KeyboardEvent) {
        if (!open)
            return

        if (event.code === "Enter") {
            event.preventDefault()
            if (filteredItems.length > 0) {
                selectItem(filteredItems[0].value)
            }
            open = false;
        }
    }

    function toggleOpen() {
        open = !open;
        if (open) {
            // reset search
            search = "";
            highlightedIndex = filteredItems.length > 0 ? 0 : -1;
            // wait a tick to focus input
            requestAnimationFrame(() => inputEl?.focus());
        }
    }
</script>

<div class="dropdown"
     on:focusin={()=> open=true}
     on:focusout={(e) => {
        const related = e.relatedTarget;
        if (!related || !e.currentTarget.contains(related)) {
            open = false;
        }
    }}
     on:keydown={handleKeyDown}
     style={style}
     tabindex="0">
    <div
            class="dropdown-header"
            class:dropdown-error={showError}
            on:click={toggleOpen}
    >

        <i class="fa fa-solid fa-caret-down"></i>
        {#if value}
            {items.find(i => i.value === value)?.name}
        {:else}
            <span class:placeholder>{placeholder}</span>
        {/if}
    </div>

    {#if open}
        <div class="dropdown-menu">
            <input
                    bind:this={inputEl}
                    type="text"
                    autofocus={true}
                    placeholder="Wyszukaj..."
                    bind:value={search}
                    class="search-input"/>

            {#each filteredItems as item (item.value)}
                <div class="dropdown-item" on:click={() => selectItem(item.value)}>
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
        background: color-mix(in srgb, var(--text-error) 10%, var(--bg-primary) 20%) !important;
    }

    .dropdown {
        position: relative;
        width: 100%;
        border-radius: var(--radius-medium);
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
        max-height: 300px;
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


    /* === Visual clarity + comfort tweaks (CSS only) === */

    .dropdown-menu {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;

        background: var(--bg-primary);
        border: var(--border-size-medium) solid var(--bg-tertiary);
        border-radius: var(--radius-medium);

        max-height: 280px;
        overflow-y: auto;
        z-index: 100;

        /* subtle elevation */
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15),
        0 2px 6px rgba(0, 0, 0, 0.08);
    }

    /* nicer scrollbar (WebKit + modern browsers) */
    .dropdown-menu::-webkit-scrollbar {
        width: 8px;
    }

    .dropdown-menu::-webkit-scrollbar-track {
        background: transparent;
    }

    .dropdown-menu::-webkit-scrollbar-thumb {
        background: var(--bg-tertiary);
        border-radius: 6px;
    }

    .dropdown-menu::-webkit-scrollbar-thumb:hover {
        background: color-mix(in srgb, var(--bg-tertiary) 70%, var(--text-primary));
    }

    /* search input separation */
    .search-input {
        width: 100%;
        padding: 0.6em 0.75em;
        border: none;
        border-bottom: 1px solid var(--bg-tertiary);
        background: var(--bg-secondary);
        color: var(--text-primary);
        outline: none;

        font-size: 0.95em;
    }

    /* dropdown items */
    .dropdown-item {
        padding: 0.65em 1em;
        cursor: pointer;

        display: flex;
        align-items: center;

        color: var(--text-primary);
        border-radius: 6px;
        margin: 0.15em 0.3em;

        transition: background-color 150ms ease,
        color 150ms ease,
        transform 120ms ease;
    }

    /* hover = clearer intent */
    .dropdown-item:hover {
        background: color-mix(in srgb, var(--bg-tertiary) 70%, var(--bg-primary));
        color: var(--text-primary);
        transform: translateX(2px);
    }

    /* active click feedback */
    .dropdown-item:active {
        background: color-mix(in srgb, var(--bg-tertiary) 85%, var(--bg-primary));
        transform: translateX(1px);
    }

    /* empty state */
    .dropdown-empty {
        padding: 0.8em 1em;
        margin: 0.3em;
        border-radius: 6px;

        color: var(--text-secondary);
        background: color-mix(in srgb, var(--bg-secondary) 80%, var(--bg-primary));
        font-style: italic;
        text-align: center;
    }

    /* header polish */
    .dropdown-header {
        background: var(--bg-primary);
        border: var(--border-size-medium) solid var(--bg-tertiary);
        padding: var(--padding-medium) 1em;
        border-radius: var(--radius-medium);

        display: flex;
        align-items: center;
        /*justify-content: space-between;*/
        gap: 0.5em;

        color: var(--text-primary);
        cursor: pointer;

        transition: border-color 150ms ease,
        background-color 150ms ease,
        box-shadow 150ms ease;
    }

    .dropdown-header:hover {
        border-color: color-mix(in srgb, var(--bg-tertiary) 60%, var(--text-primary));
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

</style>