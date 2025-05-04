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
        onClick = () => {
        },
        ...props
    }: TabsProps = $props();

    let elementPointer: HTMLHtmlElement;
    let animator: any;

    let isVertical = $derived.by(() => {
        if (!props?.direction)
            return true;
        if (props?.direction.includes('row'))
            return true
        return false;
    })
    let innerSize = (100 / items.length) + "%"
    let step = 100 / items.length;

    let flyingElementStyles = $derived.by(() => {
        if (isVertical) {
            return `width: ${innerSize};`
        }
        return `height:${innerSize}; width:100%`
    })

    onMount(() => {
        animator = animatedElement(elementPointer)
    })

    $effect(() => {
        props.direction
        let index = getIndex();
        if (isVertical) {
            elementPointer.style.width = `${step}%`
            elementPointer.style.left = `${index * step}%`
            animator.top(0, 0);
        } else {
            elementPointer.style.top = `0`
            animator.left(0, 0);
        }
    })

    const handleClick = (item: TabsItem, event: MouseEvent) => {
        vibrate();
        selectedItem = item;
        selectedComponent = item.component;

        if (selectedItem.onClick)
            selectedItem.onClick(item, event)
        if (onClick)
            onClick(item, event)
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
        if (isVertical) {
            animator.left(`${step * index}%`, 400, fn);
        } else {
            animator.top(`${step * index}%`, 400, fn);
        }
    })

    onMount(() => {
        if (items.length > 0)
            handleClick(selectedItem ?? items[0], undefined);

    })


    function handleKeyDown(event: KeyboardEvent, item: TabsItem) {
        if (event.key === "Enter" || event.code === "Enter") {
            event.preventDefault();
            handleClick(item, event);
        }
    }

</script>


{#snippet BlankComponent()}
    <div></div>
{/snippet}

<Element
        radius='22px'
        background={flutiTheme.background.tertiary}
        width="100%"
        padding="0.5em">

    <Element
            width="100%"
            style="position: relative;"
            {...props}>

        <div bind:this={elementPointer} class="btn-bg" style={flyingElementStyles}/>
        {#each items as item}
            <div tabindex="0"
                 class="btn-tab"
                 style="color: {selectedItem?.name === item.name?flutiTheme.background.accent:''}"
                 onkeydown={(e)=> handleKeyDown(e,item)}
                 onclick={(e) => handleClick(item,e)}>

                {#if item.icon}
                    <Element
                            width="100%"
                            justify="flex-start"
                            padding="0 1em"
                            style="position: absolute; width: 100%; pointer-events: none">
                        <Element width="30px">
                            <i class="{item.icon}"></i>
                        </Element>
                    </Element>
                {/if}
                {#if item.name}
                    <div>
                        {item.name}
                    </div>
                {/if}

            </div>
        {/each}
    </Element>
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