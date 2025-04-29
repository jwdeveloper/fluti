<script>
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let {
        style = '',
        fontSize = "1.5em",
        margin = "0",
        height='',
        vertical = false,
        children = undefined
    } = $props();
</script>


{#snippet Bar()}
    <Element width="100%" height="100%">
        <div class={vertical?'bar-vertical':'bar-horizontal'} style='margin: {margin}; height:{height}; {style}'/>
    </Element>

{/snippet}

{#if children}
    <Element gap="1em" width="100%">
        {@render Bar()}
        <Element
                height="100%"
                fontSize={fontSize}
                color={'var(--text-muted)'}
                style="
         text-wrap: nowrap;
         font-weight: bold;">
            {@render children?.()}
        </Element>
        {@render Bar()}
    </Element>

{:else }
    {@render Bar()}
{/if}

<style>

    :global(.bar-horizontal) {
        background: var(--text-muted) !important;
        width: 100%;
        border-radius: 0.1em;
        height: 0.1em;
    }

    :global(.bar-vertical) {
        background: var(--text-muted) !important;
        width: 0.1em;
        border-radius: 0.1em;
        height: 100%;

    }

</style>