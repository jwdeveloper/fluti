<script lang="ts">
    import Title from "$lib/fluti/components/title/Title.svelte";
    import Input from "$lib/fluti/components/input/Input.svelte";
    import ListGroup from "$lib/fluti/components/list/ListGroup.svelte";
    import type {ListWindowProps} from "./ListWindowTypes";
    import {addArrowController} from "$lib/fluti/effects/ArrowController";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import {useWindow} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte.js";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import {onMount} from "svelte";

    let {
        title,
        items,
        onSelect,
        window,
        insert,
        remove,
        width="500px"
    }: ListWindowProps = $props();

    let input = $state('')
    let insertFormWindow = useWindow(insert?.formTemplate ?? undefined);

    let isLoading = $state(false)
    let providedItems = $state([])

    onMount(() => {
        if (items === undefined)
            return;

        if (typeof items !== "function") {
            providedItems = items;
            return
        }
        fetchItemsAsync();
    })

    async function fetchItemsAsync() {
        isLoading = true;
        providedItems = await items();
        isLoading = false;
    }

    let handleSelect = (item) => {
        onSelect(item);
        window.close();
    }

    let handleInsert = async () => {
        let result = input;

        if (insert?.formTemplate) {
            result = await insertFormWindow.open();
        }
        await insert.onInsert(result);
        window.close();
    }

    const displayedItems = $derived.by(() => {

        if (providedItems === undefined)
            return []


        if (input === '')
            return providedItems;

        return providedItems.filter(e => e.name && e.name.toLowerCase().includes(input.toLowerCase()));
    })

</script>

<div use:addArrowController>
    <Panel width={width}
           direction="column"
           align="flex-start"
           justify="flex-start"
           style="max-height: 90vh; height: 90vh">
        <Panel padding="0" justify="space-between" direction="row" width="100%">
            <Title>{title}</Title>
            <Panel padding="0">
                {#if insert?.enable}
                    <Hint title={insert?.hint?? "Utwórz"}>
                        <Icon icon="fa fa-plus"
                              onClick={handleInsert}/>
                    </Hint>
                {/if}
            </Panel>
        </Panel>
        <Input bind:value={input} icon="fa fa-search" placeholder="Wyszukaj..."/>
        <ListGroup
                isOpen={true}
                allowInsert={false}
                enableDelete={remove?.enable ?? false}
                onSelect={handleSelect}
                onDelete={remove?.onRemove}
                items={displayedItems}>
        </ListGroup>
    </Panel>
</div>
