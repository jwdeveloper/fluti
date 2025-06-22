<script lang="ts">
    import Link from "$lib/fluti/components/Link.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let {
        title,
        actionTitle,
        enableAction = true,
        children = undefined,
        isLoading = false,
        actionIcon = 'fa fa-arrow-left',
        buttonProps = undefined,
        onButtonClick = (e: MouseEvent) => {
        },
        onActionClick = (e: MouseEvent) => {
        }
    } = $props();

</script>


<Element direction="column" width="100%" gap="0.5em" padding="0">

    <Button2 onClick={onButtonClick}
             variant="filled"
             isLoading={isLoading}
             disabled={isLoading}
             fullWidth={true}
             {...buttonProps}>
        {title}
    </Button2>

    {@render children?.()}


    {#if enableAction && actionTitle}
        <Link onClick={onActionClick}>
            <Element>
                <i class={actionIcon}></i>
                {actionTitle}
            </Element>
        </Link>
    {/if}

</Element>
