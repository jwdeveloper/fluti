<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import {scale as effect} from "svelte/transition";


    let {children, title, fullWidth = false, style = ''} = $props();
    let show = $state(false)
</script>


<div
        onmouseenter={()=> show = true}
        onmouseleave={()=> show = false}
        class="contianer"
        style="  width: {fullWidth?'100%':'auto'} {style}"
>
    {#if show && title !== undefined}
        <div style="pointer-events: none;" class="hint" transition:effect>
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

    .wide-icon {
        border-radius: 0.8em;
        gap: 0.7em;
        display: grid;
        grid-template-columns: auto 1fr;
        width: auto;
        padding: 0 0.8em;
        transition: all 0.2s ease-in-out;
        position: relative;
        cursor: pointer;
        border: 2px solid var(--color-ligher);
        color: var(--color-darkerst);
    }

    .hint {
        position: fixed;
        z-index: 2000;
        transform: translate(0, 125%);
    }

</style>