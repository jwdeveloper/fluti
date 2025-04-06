<script lang="ts">
    import {scale as effect} from "svelte/transition";
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";


    interface HintProps extends ElementProps {
        title?: string | undefined
        keepVisible?: boolean
    }

    let {
        children,
        keepOpen = false,
        title,
        fullWidth = false, style = '',
        offset = "125%",
        xOffset = "0",
        panelStyle,
        keepVisible = false,
        show = $bindable(false)
    }: HintProps = $props();

    let handleOpen = () => {
        show = true;
    }

    let handleClose = () => {
        show = false;
    }

    let shouldOpen = $derived.by(() => {
        if (keepOpen)
            return true;

        return show;
    })

    let getHtmlLines = $derived.by(() => {
        if (!title)
            return []

        return title.split("\\n")
    });
</script>


<div onmouseenter={handleOpen}
     onmouseleave={handleClose}
     class="contianer"
     style="width: {fullWidth?'100%':'auto'} {style}">

    {#if keepVisible || (shouldOpen && title !== undefined)}
        <div style="
        transform: translate({xOffset}, {offset});
        z-index: var(--z-index-2);
        pointer-events: none;
        {panelStyle};
    "
             class="hint"
             transition:effect>
            <Panel padding="0.6em" style="border-width: 2px; text-wrap: nowrap;">
                <h5>
                    {#each getHtmlLines as line}
                        <div>
                            {line}
                        </div>
                    {/each}
                </h5>
            </Panel>
        </div>
    {/if}

    {#if children}
        {@render children()}
    {/if}
</div>


<style>
    .contianer {
        width: auto;
        height: auto;
        position: relative;
    }

    .hint {
        position: absolute;
        z-index: var(--z-index-4);
    }

</style>