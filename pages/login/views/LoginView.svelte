<script lang="ts">
    import OAuthLogin from "../components/OAuthLogin.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Link from "$lib/fluti/components/Link.svelte";
    import {blur, scale, fly, slide} from "svelte/transition";
    import FormFieldsLogin from "../components/FormFieldsLogin.svelte";
    import {onMount} from "svelte";
    import type {LoginViewProps} from "../loginPageTypes";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import ButtonLogin from "$lib/fluti/pages/login/components/ButtonLogin.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";

    let {controller}: LoginViewProps = $props();
    let logoVisible = $state(false)
    let logo = "logo.png"


    let translation = controller.props.messages.loginView;

    onMount(() => {
        logoVisible = true;
    })

</script>


{#snippet Logo()}
    <Element
            style="position: relative; "
            align="flex-start"
            onClick={()=> window.location.href = '/'}
            mobile={{height:'0px',style:'top:80px', align:'flex-end'}}>
        {#if logoVisible}
            <div in:fly={{delay:0, duration:1500}}>
                <img height="130px" width="130px" src={logo}/>
            </div>
        {/if}
    </Element>
{/snippet}


{#snippet PrivacyPolicy()}
    <h6 style="font-weight: normal;
         text-align: center;
         width: 100%;
         margin-bottom: 1em;
         padding: 0 var(--padding-medium)">
        {translation.rules.accept}
        <a style="border-bottom: 1px solid {flutiTheme.color.light}"
           href={controller?.props?.links?.termsAndCondition ?? "/blog/terms" }>{translation.rules.terms}</a>,
        <a style="border-bottom: 1px solid {flutiTheme.color.light}"
           href={controller?.props?.links?.privacyPolicy ?? "/blog/privacy" }>{translation.rules.policy}</a>
    </h6>
{/snippet}

<Element
        height="100%"
        width="100%"
        direction="column">

    {#if controller.props?.templates?.logoTemplate}
        <svelte:component this={controller.props.templates.logoTemplate} {...controller.props}/>
    {:else}
        <Logo/>
    {/if}

    {#if translation.top.subtitle}
        <h5 style="font-weight: normal;
         text-align: center;
         width: 100%;
         margin-bottom: 1em;
         padding: 0 var(--padding-medium)">
            {translation.top.subtitle}
        </h5>
    {/if}


    <h5 style:height={flutiTheme.font.small} style:color={flutiTheme.color.error}>
        {#if controller.error}
            {controller.error}
        {/if}
    </h5>

    {#if controller.props?.oAuth?.enable}
        <OAuthLogin
                controller={controller}
                translation={translation}
                onProviderClick={(p)=> controller.loginOAuth(p)}/>


        <Separator style="
         height: 0.1em;
         background: var(--bg-secondary)">
            <div style="color: var(--text-muted);
             display: flex;
             font-size: 0.6em; font-weight: 500">
                {translation.or}
            </div>
        </Separator>
        <Space variant="tiny"/>
    {/if}


    <Element direction="column" width="100%">
        <FormFieldsLogin transition={translation}
                         controller={controller}
                         enablePassword={true}/>
    </Element>

    <Element
            align="flex-end"
            width="100%" direction="column">
        <Element padding="0"
                 mobile={{
                      width:'100%',
                      padding:'0'
                 }}
                 width="300px"
                 justify="flex-end">

            <Link onClick={()=> controller.view = 'recovery'}>
                {translation.forgotPassword}
            </Link>
        </Element>
        <ButtonLogin
                isLoading={controller.isLoading}
                title={translation.button.title}
                onButtonClick={()=>controller.login()}
                onActionClick={() => controller.view = 'register'}
                actionIcon="fa fa-user"
                actionTitle={translation.button.subtitle}>
            {@render PrivacyPolicy()}
        </ButtonLogin>
    </Element>
</Element>




