<script lang="ts">
    import {onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";


    interface DefaultMenuItemProps {
        name: string
        key?: string
        link?: string
    }

    interface DefaultMenuProps extends ElementProps {
        items: DefaultMenuItemProps[]
        highlightColor?: string
        currentItemKey?: string
        onClick?: (item: DefaultMenuItemProps) => void
    }


    const {
        items,
        highlightColor = flutiTheme.background.transparent,
        currentItemKey,
        onClick = () => {
        },
        ...props
    }: DefaultMenuProps = $props()

    let element: HTMLHtmlElement;
    let aElement: any;
    let selectedItemKey = $state(currentItemKey);
    let isBackVisible = $state(false)
    const time = 300;
    let menuDirection = $derived.by(() => {
        return props.direction ?? 'row';
    })

    onMount(() => {
        aElement = animatedElement(element)
        selectedItemKey = currentItemKey ?? window.location.pathname;
    })

    const handleClick = (item: DefaultMenuItemProps) => {
        selectedItemKey = item.key
        onClick(item)
    }

    let targetElement: HTMLHtmlElement

    let setElementSource = async (element) => {
        targetElement = element.srcElement
        if (menuDirection === 'row') {
            let width = targetElement.clientWidth + "px"
            aElement.width(width, time)
            aElement.left(targetElement.offsetLeft + "px", time)
        } else {
            let height = targetElement.clientHeight + "px"
            aElement.height(height, time)
            aElement.top(targetElement.offsetTop + "px", time)
        }

    }


    let handleEnter = async (a, event) => {
        let enteredElement: HTMLHtmlElement = document.elementFromPoint(event.clientX, event.clientY);
        if (isBackVisible === false && a === true && enteredElement) {


            if (enteredElement.classList.contains('menu-item')) {
                if (menuDirection === 'row') {
                    await aElement.width(enteredElement.clientWidth + "px", 0)
                    await aElement.left(enteredElement.offsetLeft + "px", 0)

                } else {
                    await aElement.height(enteredElement.clientHeight + "px", 0)
                    await aElement.top(enteredElement.offsetTop + "px", 0)
                }

            }

        }
        isBackVisible = a;
        if (!isBackVisible)
            aElement.opacity(0, 200)
        else
            aElement.opacity(1, 0)
    }

</script>


{#snippet MenuItem(item)}

    {@const elementType = item.link ? 'a' : 'button'}
    {@const elementKey = item.key ?? item.link ?? item.name}

    <svelte:element this={elementType}
                    href={item.link??"/"}
                    class="menu-item"
                    style='color:{selectedItemKey === elementKey?flutiTheme.background.accent:""}'
                    onclick={()=> handleClick(item)}
                    onmouseenter={setElementSource}>
        {item.name}
    </svelte:element>


{/snippet}

{#snippet FloatingBackground()}
    <Element
            bind:element={element}
            height={menuDirection === 'row'? '100%': 'auto'}
            width={menuDirection !== 'row'? '100%': 'auto'}
            style="position: absolute; pointer-events: none"
            radius={flutiTheme.radius.large}
            background={highlightColor}
    >
    </Element>

{/snippet}

<Element
        padding="0 1em"
        style="position: relative"
        tag="nav"
        attributes={{
            onmouseenter:(e)=>handleEnter(true,e),
            onmouseleave:(e)=>handleEnter(false,e)}}
        justify="space-around"
        align="center"
        {...props}>

    {#each items as item}
        {@render MenuItem(item)}
    {/each}
    {@render FloatingBackground()}
</Element>

<style>
    .menu-item {
        padding: 0.9em 1.5em;
        border-radius: var(--radius-strong);
        cursor: pointer;
        transition: all 200ms ease-in-out;
        z-index: var(--z-index-2);
        font-weight: bold;
    }

    .menu-item:hover {
        color: var(--text-light);
    }
</style>