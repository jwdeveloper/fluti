<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Link from "$lib/fluti/components/Link.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";

    let {
        title,
        actionTitle,
        actionIcon='fa fa-arrow-left',
        onButtonClick = (e: MouseEvent) => {
        },
        onActionClick = (e: MouseEvent) => {
        }
    } = $props();

</script>


<Panel direction="column" width="100%" gap="0.5em" padding="0">

    <Button2 onClick={onButtonClick}
             variant="filled"
             fullWidth={true}>
        {title}
    </Button2>


    {#if actionTitle}
        <Link onClick={onActionClick}>
            <Panel>
                <i class={actionIcon}></i>
                {actionTitle}
            </Panel>
        </Link>
    {/if}
</Panel>
