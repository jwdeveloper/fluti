<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Input from "$lib/fluti/components/input/Input.svelte";
    import Checkbox from "$lib/fluti/components/checkbox/Checkbox.svelte";
    import Loader from "$lib/fluti/components/loader/Loader.svelte";
    import {
        scale,
    } from 'svelte/transition';
    import FloatingPanel from "$lib/fluti/components/floatingPanel/FloatingPanel.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import {onMount} from "svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";


    const handleItemSelection = async (item: any) => {
        if (multiSelect) {
            if (selected[item.value]) {
                let result = true;
                if (onDelete) {
                    isLoading = true
                    result = await onDelete(item)
                    isLoading = false
                }
                if (!result)
                    return

                delete selected[item.value]
            } else {
                let result = true;
                if (onSelect) {
                    isLoading = true
                    result = await onSelect(item)
                    isLoading = false
                }
                if (!result)
                    return

                selected[item.value] = item;
            }
            selected = {...selected}
            return
        } else {
            let result = true;
            if (onSelect) {
                isLoading = true
                result = await onSelect(item)
                isLoading = false
            }
            if (!result)
                return
        }

        value = item;
        open = false;
    }

    let handleOpen = () => {
        if (readOnly)
            return

        open = !open;
    }


    let {
        isOpen = false,
        enableSearch = true,
        multiSelect = false,
        enableDefaultSearch = $bindable(true),
        id = Math.random() + "_searchbox",
        placeholder = 'Select item...',
        searchPlaceHolder = "Search value...",
        items = $bindable([]),
        value = $bindable({text: undefined, value: undefined}),
        input = $bindable(''),
        icon = undefined,
        selected = $bindable({}),
        onSelect = undefined,
        onDelete = undefined,
        isLoading = $bindable(false),
        readOnly = false,
        placeholderTemplate = undefined,
        template = itemTemplate,
        footer = undefined,
        ...data
    } = $props();

    let open = $state(isOpen)
    let displayedItems = $derived.by(() => {
        if (!open)
            return []

        if (!enableDefaultSearch)
            return items;

        if (input === '')
            return items

        return items.filter(item => item.text.toLowerCase().includes(input.toLowerCase()))
    })

    $effect(() => {
        if (!open)
            input = ''
    })


    onMount(() => {
        if (items.length == 0) {
            return
        }
        // if (items[0]['text'] === undefined) {
        //     items = items.map((item, index) => {
        //         return {text: item, value: index}
        //     })
        // }
    })

</script>

{#snippet selectedValuesTemplate()}
    {#if Object.keys(selected).length === 0}
        <div>
            {placeholder}
        </div>
    {:else}
        <Panel
                padding="0"
                columns="repeat(auto-fill, minmax(auto, 1fr))"
                justify="flex-start"
                width="100%"
                rows="1fr"
                gap="1em">
            {#each Object.keys(selected) as key}
                <div transition:scale
                     style="font-weight: bold;">
                    {selected[key].text}
                </div>
            {/each}
        </Panel>

    {/if}

{/snippet}

{#snippet itemTemplate(item)}
    <Panel columns="1fr 1fr"
           onClick={()=>handleItemSelection(item)}
           height="100%"
           ripplerEffect={true}
           className="item-template"
           width="100%">

        {#if multiSelect}
            <Panel padding="0" justify="flex-start">
                <Checkbox value={selected[item.value]}/>
            </Panel>
        {/if}
        <Panel width="100%" height="100%" padding="0 0.5em" justify="flex-start">
            <div style="text-wrap: nowrap">
                {item.text}
            </div>
        </Panel>
        {#if !multiSelect}
            <Panel justify="flex-end" height="100%" style="color: var(--bg-accent)">
                {#if item.value === value.value}
                    <i class="fa fa-check"/>
                {/if}
            </Panel>
        {/if}
    </Panel>
{/snippet}

<FloatingPanel bind:isOpen={open}>

    {#snippet headerSlot()}

        <Icon rightIcon="fa-solid fa-sort"
              icon={icon}
              style="width: 100%; "
              onClick={handleOpen}>
            <Panel width="100%" padding="0 0.5em">
                <div style="text-wrap: nowrap; font-weight: 400; width: 100%">
                    {#if placeholderTemplate}
                        {@render placeholderTemplate()}
                    {:else }
                        {#if multiSelect}
                            {@render selectedValuesTemplate()}
                        {:else}
                            {#if value.text === undefined}
                                <div style="color: var(--text-primary)">
                                    {placeholder}
                                </div>
                            {:else}
                                {value.text}
                            {/if}
                        {/if}
                    {/if}
                </div>
            </Panel>
        </Icon>

    {/snippet}

    {#snippet contentSlot()}
        <Panel direction="column"
               width="200px"
               background="var(--bg-primary)"
               padding="0"
               justify="flex-start"
               gap="0"
               style="
                 z-index: var(--z-index-4);
                 box-shadow: 0 0 1em 0.1em var(--shadow);
                 border: 2px solid var(--bg-tertiary);
                 top: 5px;
                 pointer-events: auto"
               overflow="hidden">

            {#if enableSearch}
                <Panel padding="0.5em"
                       direction="column"
                       gap="0.1em"
                       width="100%">
                    <Input placeholder={searchPlaceHolder}
                           bind:value={input}
                           icon="fa fa-search"/>
                </Panel>
                <Separator/>
            {/if}

            <Panel
                    direction="column"
                    width="100%"
                    height="100%"
                    maxHeight="300px"
                    gap="0.5em"
                    padding="0"
                    justify="flex-start"
                    style="overflow-x: hidden; min-height: 200px"
                    overflow="scroll">

                {#if isLoading}
                    <div style="position: absolute; width: 100%; height: 100%;
                    z-index: var(--z-index-3)">
                        <Loader isLoading={isLoading}/>
                    </div>
                {/if}
                {#each displayedItems as item (item.value)}
                    {@render template(item)}
                {/each}
            </Panel>

            {#if footer}
                <div class="separator">
                </div>
                <Panel width="100%" justify="flex-start" padding="0.5em">
                    {@render footer(input, open)}
                </Panel>
            {/if}
        </Panel>
    {/snippet}
</FloatingPanel>


<style>
    :global(.item-template) {
        min-height: 30px !important;

    }

    :global(.item-template:hover) {
        background: var(--bg-secondary);
        cursor: pointer;
    }
</style>