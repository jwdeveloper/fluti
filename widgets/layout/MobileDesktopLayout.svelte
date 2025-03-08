<script lang="ts">
    import {onMount} from "svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";

    interface MobileDesktopLayoutProps {
        panel?: ElementProps// props of root panel
        slotPanel?: ElementProps //props of left, center, right panels
        width?: string // width of the center panel in %
        breakpoint?: number //value in px when layout should break to mobile

        hideSidePanelsOnMobile?: boolean //hides left and right panel on mobile device

        left?: any
        center?: any
        right?: any
    }

    let props: MobileDesktopLayoutProps = $props();
    let isInit = $state(false)

    onMount(() => {
        isInit = true;
    })

    let shouldBreak = $derived.by(() => {
        if (!props?.breakpoint)
            return breakpoints.isMobile;
        return breakpoints.width <= props.breakpoint;
    })

    let getGridTemplate = () => {


        let width = props?.width ?? "60%"
        let intWidth = parseInt(width) / 100;
        let remainSpace = 1 - intWidth;

        return `${remainSpace / 2}fr ${intWidth}fr ${remainSpace / 2}fr`
    }

    let dimentions = $derived.by(() => {

        if (isInit && shouldHideSidePanels)
            return {
                rows: '1fr',
                columns: '1fr'
            }

        if (shouldBreak) {
            return {
                rows: getGridTemplate(),
                columns: "1fr"
            }
        } else {
            return {
                rows: '1fr',
                columns: getGridTemplate()
            }
        }
    })

    let shouldHideSidePanels = $derived.by(() => {
        if (!shouldBreak) {
            return false;
        }
        return props.hideSidePanelsOnMobile === true;
    })

</script>

{#snippet renderSlot(slot, side)}
    <Element width="100%"
             height="100%"
             tag={side?"aside":"section"}
             {...props.slotPanel}>
        {#if slot !== undefined}
            {@render slot()}
        {/if}
    </Element>
{/snippet}


<Element
        display="grid"
        tag="main"
        columns={dimentions.columns}
        rows={dimentions.rows}
        width="100%"
        height="100%"
        gap="0"
        align="flex-start"
        {...props.panel}>

    {#if !shouldHideSidePanels}
        {@render renderSlot(props?.left, true)}
    {/if}

    {@render renderSlot(props?.center, false)}

    {#if !shouldHideSidePanels}
        {@render renderSlot(props?.right, true)}
    {/if}
</Element>


