<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
    import {onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";

    interface PanelProps extends ElementProps {
        zIndex?: number
    }

    let {
        zIndex = 0,
        style,
        ...props
    }: PanelProps = $props();

    let element: HTMLHtmlElement;
    let aElement;

    onMount(() => {
        if (!element)
            return

        aElement = animatedElement(element)

    })

</script>


<Element
        bind:element={element}
        tag="section"
        padding="2.5em 2.5em"
        width="100%"
        radius="var(--radius-large)"
        direction="column" gap="1em"
        style=" position: relative;  transform-origin:center;
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12), 0 1px 2px 0 rgba(0, 0, 0, .08);
        {zIndex > 0?'z-index:'+zIndex+';':''}

        {style};"
        background="var(--bg-primary)"
        {...props}>
    <slot/>
</Element>