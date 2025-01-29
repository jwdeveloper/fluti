<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import {scale as effect} from "svelte/transition";

    let {
        children,
        keepOpen = false,
        title,
        fullWidth = false, style = '',
        offset = "125%"
    } = $props();
    let show = $state(false)

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

</script>


<div
        onmouseenter={handleOpen}
        onmouseleave={handleClose}
        class="contianer"
        style="  width: {fullWidth?'100%':'auto'} {style}"
>
    {#if shouldOpen && title !== undefined}
        <div style="
        transform: translate(0, {offset});
        z-index: var(--z-index-3);
        overflow:hidden;
        pointer-events: none;"

             class="hint"
             transition:effect>
            <Panel variant="component-panel-border-dark"
                   padding="0.6em"
                   style="text-wrap: nowrap;">
                {title}
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
    }

    .hint {
        position: fixed;
        z-index: var(--z-index-4);
    }

</style>