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

    let {controller, translation = {}}: LoginViewProps = $props();
    let logoVisible = $state(false)
    let logo = "icons/logo.png"

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


<Element
        height="100%"
        width="100%"
        direction="column"
        gap="0">

    {#if controller.props?.templates?.logoTemplate}
        <svelte:component this={controller.props.templates.logoTemplate} {...controller.props}/>
    {:else}
        <Logo/>
    {/if}

    {#if controller.props?.messages?.subtitle}
        <h5 style="font-weight: normal;
         text-align: center;
         width: 100%;
         margin-bottom: 1em;
         padding: 0 var(--padding-medium)">
            {controller.props?.messages?.subtitle}
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

        <Separator
                margin="1em 0 2em 0"
                style="
         height: 0.1em;
         background: var(--bg-secondary)">
            <div style="color: var(--text-muted);
             display: flex;
             font-size: 0.6em; font-weight: 500">
                {translation.alternative}
            </div>
        </Separator>
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
                title="Continue"
                onButtonClick={()=>controller.login()}
                onActionClick={() => controller.view = 'register'}
                actionIcon="fa fa-user"
                actionTitle="Utwórz konto"/>
    </Element>
</Element>


