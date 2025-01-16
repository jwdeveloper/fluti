<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Link from "$lib/fluti/components/Link.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";

    let {
        title,
        actionTitle,
        onButtonClick = (e: MouseEvent) => {
        },
        onActionClick = (e: MouseEvent) => {
        }
    } = $props();

</script>


<Panel direction="column" width="100%" gap="0.5em" padding="0">
    <Icon fullWidth={true}
          textCenter={true}
          onClick={onButtonClick} icon="fa">
        {title}
    </Icon>

    {#if actionTitle}
        <Link onClick={onActionClick}>
            <Panel>
                <i class="fa fa-arrow-left"></i>
                {actionTitle}
            </Panel>
        </Link>
    {/if}
</Panel>
