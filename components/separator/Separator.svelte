<script>
    import Panel from "$lib/fluti/components/panel/Panel.svelte";

    let {
        style = '',
        fontSize = "1.5em",
        margin = "0",
        children = undefined
    } = $props();
</script>


{#snippet Bar()}
    <div class="bar" style='margin: {margin}; {style}'>
    </div>
{/snippet}

{#if children}
    <Panel width="100%" padding="0">

        <Bar/>
        <Panel style="
        text-wrap: nowrap;
         font-weight: bold;
            font-size: {fontSize};

         color: var(--text-primary)">
            {@render children()}
        </Panel>
        <Bar/>
    </Panel>

{:else }
    <Bar/>
{/if}

<style>

    .bar {
        background: var(--bg-tertiary);
        width: 100%;
        border-radius: 0.1em;
        height: 0.1em;
    }

</style>