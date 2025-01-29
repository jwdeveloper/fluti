<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import {useBreakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";
    import type {PanelProps} from "$lib/fluti/components/panel/Panel.type";
    import {onMount} from "svelte";

    interface MobileDesktopLayoutProps {
        panel?: PanelProps// props of root panel
        slotPanel?: PanelProps //props of left, center, right panels
        width?: string // width of the center panel in %
        breakpoint?: number //value in px when layout should break to mobile

        hideSidePanelsOnMobile?: boolean //hides left and right panel on mobile device

        left?: any
        center?: any
        right?: any
    }

    let breakpoints = useBreakpoints();
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
        if (!shouldBreak)
            return false;

        return props.hideSidePanelsOnMobile === true;
    })

</script>

{#snippet renderSlot(slot)}
    <Panel width="100%"
           height="100%"
           radius="0"
           tag="section"
           {...props.slotPanel}>
        {#if slot !== undefined}
            {@render slot()}
        {/if}
    </Panel>
{/snippet}


<Panel panelType="grid"
       columns={dimentions.columns}
       rows={dimentions.rows}
       height="100%"
       width="100%"
       radius="0"
       gap="0"
       {...props.panel}
>
    {#if !shouldHideSidePanels}
        {@render renderSlot(props?.left)}
    {/if}

    {@render renderSlot(props?.center)}

    {#if !shouldHideSidePanels}
        {@render renderSlot(props?.right)}
    {/if}

</Panel>