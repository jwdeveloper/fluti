<script lang="ts">

    import type {TabsItem, TabsProps} from "./Tabs";
    import {onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import {vibrate} from "$lib/fluti/utils/Wait";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

    let {
        items,
        selectedComponent = $bindable(BlankComponent),
        selectedItem = $bindable(undefined),
        initialWidth = "100%",
        ...props
    }: TabsProps = $props();

    let elementPointer: HTMLHtmlElement;
    let step = 100 / items.length;

    const handleClick = (item: TabsItem) => {
        vibrate();
        selectedItem = item;
        selectedComponent = item.component;
    }

    const getIndex = () => {
        let index = 0;
        for (let item of items) {
            if (selectedItem === undefined)
                break
            if (item.name === selectedItem.name) {
                break
            }
            index++;
        }
        return index;
    }

    $effect(() => {
        let index = getIndex();
        let fn = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
        let animator = animatedElement(elementPointer);
        animator.left(`${step * index}%`, 400, fn);
    })

    onMount(() => {
        if (items.length > 0)
            handleClick(selectedItem ?? items[0]);

        let index = getIndex();
        elementPointer.style.width = `${step}%`
        elementPointer.style.left = `${index * step}%`
    })


    function handleKeyDown(event: KeyboardEvent, item: TabsItem) {
        if (event.key === "Enter" || event.code === "Enter") {
            event.preventDefault(); // Prevent default behavior if needed
            handleClick(item);
        }
    }
</script>


{#snippet BlankComponent()}
    <div></div>
{/snippet}

<Element radius='19px'
         background={flutiTheme.background.tertiary}
         width="100%"
         style="position: relative"
         {...props}>

    <div bind:this={elementPointer} class="btn-bg" style="width: {initialWidth}"/>
    {#each items as item}
        <div tabindex="0"
             class="btn-tab"
             style="color: {selectedItem?.name === item.name?flutiTheme.background.accent:''}"
             onkeydown={(e)=> handleKeyDown(e,item)}
             onclick={() => handleClick(item)}>
            <i class="{item.icon}"></i>
            <div>
                {item.name}
            </div>
        </div>
    {/each}
</Element>


<style>


    .btn-tab {
        /*font-weight: 600;*/
        font-weight: 400;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.3em;
        border-right: none;
        cursor: pointer;
        transition: all 300ms ease-in-out;
        font-size: var(--font-size-normaler);
        position: relative;
        overflow: hidden;
        padding: 0.6em 1.2em;
        width: 100%;
        z-index: var(--z-index-1);
        color: var(--text-muted);



    }

    .btn-bg {

        position: absolute;
        left: 0;
        top: 0;
        z-index: var(--z-index-1);
        scale: 0.9;
        height: 100%;
        border: none;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: var(--radius-large);
        color: var(--accent-primary);
        font-size: var(--font-size-normaler);
        background: var(--bg-primary);
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12), 0 1px 2px 0 rgba(0, 0, 0, .08);
    }
</style>