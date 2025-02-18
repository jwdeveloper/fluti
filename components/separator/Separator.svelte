<script>
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let {
        style = '',
        fontSize = "1.5em",
        margin = "0",
        children = undefined
    } = $props();
</script>


{#snippet Bar()}
    <Element width="100%" height="100%">
        <div class="bar" style='margin: {margin}; {style}'/>
    </Element>

{/snippet}

{#if children}
    <Element gap="1em" width="100%">
        <Bar/>
        <Element
                height="100%"
                fontSize={fontSize}
                color={'var(--text-muted)'}
                style="
         text-wrap: nowrap;
         font-weight: bold;">
            {@render children()}
        </Element>
        <Bar/>
    </Element>
{:else }
    <Bar/>
{/if}

<style>

    .bar {
        background: var(--text-muted);
        width: 100%;
        border-radius: 0.1em;
        height: 0.1em;
    }

</style>