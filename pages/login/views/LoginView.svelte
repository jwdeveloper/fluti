<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";

    import OAuthLogin from "../components/OAuthLogin.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import ButtonLogin from "../components/ButtonLogin.svelte";
    import Link from "$lib/fluti/components/Link.svelte";
    import {blur, scale, fly, slide} from "svelte/transition";
    import FormFieldsLogin from "../components/FormFieldsLogin.svelte";
    import {onMount} from "svelte";
    import type {LoginViewProps} from "../loginWindowTypes";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";

    let {controller, translation = {}}: LoginViewProps = $props();
    let logoVisible = $state(false)
    let logo = "icons/icon.png"

    onMount(() => {
        logoVisible = true;
    })
</script>


{#snippet Logo()}
    <Panel
            style="position: relative; top: -80px"
            height="50px"
            align="flex-start"
            breakpoints={{
               "sm":{height:'0px', alignItems:'flex-end'}
           }}
            padding="0">
        {#if logoVisible}
            <div in:fly={{delay:0, duration:1500}}>
                <img height="130px" width="130px" src={logo}/>
            </div>
        {/if}
    </Panel>
{/snippet}


<Panel
        height="100%"
        breakpoints={{
           'sm':{width:"100% "},
           'md':{width:"100% "},
       }}
        direction="column"
        padding="0"
        gap="0"
>

    <Logo/>

    <Panel direction="column" width="100%" padding="0">
        <FormFieldsLogin transition={translation}
                         controller={controller}
                         enablePassword={true}/>
    </Panel>

    <Panel padding="1.5em 0 1em"
           align="flex-end"
           width="100%" direction="column">
        <Panel padding="0"
               breakpoints="{{
                     'sm':{
                      width:'100%',
                      padding:'0'},
               }}"
               width="300px" justify="flex-end">
            <Link style="margin-bottom: 2em" onClick={()=> controller.view = 'recovery'}>
                {translation.forgotPassword}
            </Link>
        </Panel>
        <Panel direction="column" style="align-self: flex-end" width="100%">
            <Panel width="100%">
                <Icon fullWidth={true}
                      textCenter={true}
                      boldFont={false}
                      onClick={()=> controller.login()}>
                    {translation.signIn}
                </Icon>
            </Panel>
        </Panel>


        {#if controller.props.oAuth}
            <Panel direction="column"  width="100%">
                <Separator fontSize="1em">{translation.alternative}</Separator>
            </Panel>
            <Panel padding="0"
                   width="100%">
                <OAuthLogin onClick={(p)=> controller.loginOAuth(p)} icons={true}/>
            </Panel>
        {/if}

    </Panel>


    <Link>
        <Panel onClick={()=>controller.view="register"}>
            <div>
                Utworz konto
            </div>
            <i class="fa fa-user-plus"></i>
        </Panel>
    </Link>

</Panel>
