<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Link from "$lib/fluti/components/Link.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

    let {
        title,
        actionTitle,
        showPrivacyPolicy = false,
        isLoading = false,
        actionIcon = 'fa fa-arrow-left',
        buttonProps = undefined,
        onButtonClick = (e: MouseEvent) => {
        },
        onActionClick = (e: MouseEvent) => {
        }
    } = $props();

</script>


{#snippet PrivacyPolicy()}
    <h6 style="font-weight: normal;
         text-align: center;
         width: 100%;
         margin-bottom: 1em;
         padding: 0 var(--padding-medium)">
        By continuing, you agree to Mobbin’s
        <a style="border-bottom: 1px solid {flutiTheme.color.light}" href="/blog/terms">Terms of Service</a>
        and
        <a style="border-bottom: 1px solid {flutiTheme.color.light}" href="/blog/privacy">Privacy policy</a>
    </h6>
{/snippet}

<Panel direction="column" width="100%" gap="0.5em" padding="0">

    <Button2 onClick={onButtonClick}
             variant="filled"
             isLoading={isLoading}
             disabled={isLoading}
             fullWidth={true}
             {...buttonProps}>
        {title}
    </Button2>
    {#if showPrivacyPolicy}
        <PrivacyPolicy/>
    {/if}

    {#if actionTitle}
        <Link onClick={onActionClick}>
            <Panel>
                <i class={actionIcon}></i>
                {actionTitle}
            </Panel>
        </Link>
    {/if}
</Panel>
