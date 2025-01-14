<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Link from "$lib/fluti/components/Link.svelte";

    let {
        title,
        actionTitle,
        onButtonClick = (e:MouseEvent) => {
        },
        onActionClick = (e:MouseEvent) => {
        }
    } = $props();

</script>


<Panel direction="column" width="100%" gap="0.5em" padding="0">
    <Panel background="var(--text-light)"
           width="100%"
           height="100%"
           onClick={onButtonClick}
           ripplerEffect={true}
           ripplerEffectColor="var(--text-primary)"
           style="font-weight: bold; color: var(--bg-primary)">
        <div style="z-index: 5;">
            {title}
        </div>
    </Panel>

    {#if actionTitle}
        <Link onClick={onActionClick}>
            <Panel>
                <i class="fa fa-arrow-left"></i>
                {actionTitle}
            </Panel>
        </Link>
    {/if}
</Panel>
