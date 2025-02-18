<script lang="ts">
    import {scale as Effect} from "svelte/transition";
    import type {LoginViewProps, OAuthProvider} from "$lib/fluti/pages/login/loginPageTypes";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

    interface OAuthLoginProps extends LoginViewProps {
        onProviderClick: (provider: string) => void;
    }

    const {controller, onProviderClick}: OAuthLoginProps = $props();
    const items: OAuthProvider[] = $state(controller.props?.oAuth?.providers ?? [])
    const translations = controller.props.messages.loginView.oauth;
    const providersIcons = $derived.by(() => {
        return items.filter(e => e.onlyIcon);
    })

    const providersFullIcons = $derived.by(() => {
        return items.filter(e => !e.onlyIcon);
    })

    const TargetElement = $derived.by(() => {
        if (controller.props?.templates?.oAuthProviderTemplate) {
            return controller.props?.templates?.oAuthProviderTemplate
        }
        return OAuthButton;
    })
</script>


<Element width="100%"
         display="grid"
         columns="1fr"
         margin="1.5em 0"
         gap="0.9em"
         direction="column">
    {#each providersFullIcons as item,index}
        <div style="width: 100%" transition:Effect={{delay:index*120}}>
            {@render TargetElement(item)}
        </div>
    {/each}

    <Element width="100%">
        {#each providersIcons as item,index}
            <div style="width: 100%" transition:Effect={{delay:index*120}}>
                {@render TargetElement(item)}
            </div>
        {/each}
    </Element>
</Element>


{#snippet OAuthButton(provider)}

    <Hint title={provider.onlyIcon ? translations.continue+ " " +provider.name: undefined}>
        {@const isIcon = provider.onlyIcon}
        <Button2
                textSize="h4"
                fullWidth={true}
                onClick={()=> onProviderClick(provider.name)}
                color={provider.iconColor}
                fontSize={isIcon?'1.6em':undefined}
                padding={isIcon?flutiTheme.padding.small:flutiTheme.padding.medium}
                isShowText={!isIcon}
                radius={flutiTheme.radius.huge}
                icon='fa-brands fa-{provider.name.toLowerCase()}'>
            {#if !provider.onlyIcon}
                {translations.continue} {provider.name}
            {/if}
        </Button2>
    </Hint>
{/snippet}

