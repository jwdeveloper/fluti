<script lang="ts">
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Title from "$lib/fluti/components/title/Title.svelte";
    import Button from "$lib/fluti/components/button/Button.svelte";
    import {useWindow} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte.js";
    import Form from "$lib/fluti/components/form/Form.svelte";
    import WindowActions from "$lib/fluti/widgets/window/WindowActions.svelte";
    import Input from "$lib/fluti/components/input/Input.svelte";
    import Label from "$lib/fluti/components/label/Label.svelte";
    import {
        blur,
        crossfade,
        draw,
        fade,
        fly,
        scale,
        slide
    } from 'svelte/transition';
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import Loader from "$lib/fluti/components/loader/Loader.svelte";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let {
        titleTemplate = undefined,
        items = [],
        onSelect = () => {
        },
        onInsert = () => {
        },
        onDelete = () => {

        },
        isOpen = $bindable(false),
        allowInsert = true,
        enableDelete = false,
        useInsertTemplate = true,
        listGroup = undefined,
        isLoading = $bindable(false)
    } = $props();

    let deleteVisible = $state(-1);

    let inputValue = $state('')
    let selectedItem = $state(undefined)
    let window = useWindow(WindowForm)

    let handleInsert = () => {

        if (!useInsertTemplate) {
            onInsert()
            return
        }
        window.open();
    }

    let handleSelect = (item) => {
        if (onSelect !== undefined) {
            onSelect(item)
        }
        selectedItem = item;
    }

    let isListOpen = $derived.by(() => {
        if (listGroup) {
            return listGroup.isOpen;
        }
        return isOpen;
    })

    let handleInsertSave = async () => {
        let result = await onInsert(inputValue);
        if (result === false) {
            return false;
        }
        inputValue = ''
        clickOpen();
        window.close()
    }


    let clickOpen = () => {

        if (listGroup) {
            if (listGroup.isOpen)
                listGroup.isOpen = false;
            else
                listGroup.open();

        } else
            isOpen = true;

    }
</script>


{#snippet WindowForm()}
    <Form>
        <Panel direction="column" width="300px" height="auto" padding="0" justify="space-between">
            <Panel width="100%" justify="flex-start">
                <Label title="Nazwa">
                    <Input bind:value={inputValue}/>
                </Label>
            </Panel>
            <Panel width="100%">
                <WindowActions onSave={handleInsertSave} onCancel={()=>window.close()}/>
            </Panel>
        </Panel>
    </Form>
{/snippet}


<Element direction="column"
         width="100%"
         padding="0"
         style="overflow-y: auto; position:sticky; top: 10px"
         onMouseOver={(e)=> {
           if(e === false)
               deleteVisible = -1
       }}
         gap="0.3em">
    <Element direction="column"
             onClick={clickOpen}
             ripplerEffect={true}
             padding="0"
             width="100%" gap="0">
        <Element
                panelType="grid"
                columns="auto 1fr auto"
                style="cursor: pointer"
                width="100%">
            <Element>
                <i class="fa fa-solid fa-sort-down" style="position: relative; top: -0px"></i>
            </Element>
            <Element>
                <Title variant="title-small">
                    {#if titleTemplate}
                        {@render titleTemplate()}
                    {/if}
                </Title>
            </Element>

            {#if allowInsert}
                <Element padding="0">
                    <Hint title="Dodaj nowy">
                        <Icon icon="fa fa-plus" style="font-size: 0.7em;" onClick={handleInsert}/>
                    </Hint>
                </Element>
            {:else}
                <Element padding="1em">
                </Element>
            {/if}
        </Element>
        <Separator style="margin-bottom: 0"/>
    </Element>


    {#if isListOpen}
        <div transition:slide
             style="height: auto; width: 100%; scrollbar-width: thin; overflow-y: auto; padding: 0.1em 0.1em">
            {#each items as item}
                <Button
                        size="btn-small"
                        icon="fa "
                        style="
                        margin-bottom: 0.3em;
                        border: {selectedItem?.name === item.name ? '1px solid var(--bg-300)' : ''};
                        background: {selectedItem?.name === item.name ? 'var(--bg-200)' : ''};
"
                        onClick={()=> handleSelect(item)}
                        onMouseOver={(e)=> deleteVisible = item.name}
                        fullWidth={true}>
                    <Panel width="100%"
                           justify="space-between" padding="0">
                        {item.name}
                        {#if deleteVisible === item.name && enableDelete === true}
                            <i onclick={()=>console.log('siema')}
                               transition:blur={{delay:0.3, duration:0.3}}
                               class="fa fa-trash"/>
                        {/if}
                    </Panel>
                </Button>
            {/each}
        </div>
    {/if}

</Element>


