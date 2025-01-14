<script>
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";


    let {title, description, icon} = $props();
</script>


<Panel panelType="grid" columns="auto 1fr" width="100%" justify="flex-start" padding="0">
    {#if icon}
            <Icon icon="{icon}"/>
    {/if}
    <div style="width: 100%;
     color: var(--text-light);
      flex-wrap: nowrap !important;
     font-weight: 800;
      font-size: 1.5em">
        {title}
    </div>
</Panel>

{#if description}
    <div style="color: var(--text-primary) !important;text-wrap: nowrap; font-size: 1em">
        {description}
    </div>
{/if}

