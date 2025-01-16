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
    let logo = "https://wwsystem.com.pl/wp-content/uploads/2024/08/logo-1-328x83-1.png"

    onMount(() => {
        logoVisible = true;
    })
</script>


{#snippet Logo()}
    <Panel
            style="position: relative; top: -60px"
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
    {#if controller.props.oAuth}
        <Panel padding="0" height="100%"
               width="100%"
               style="min-height: 90px;">
            <OAuthLogin onClick={(p)=> controller.loginOAuth(p)} icons={true}/>
        </Panel>
        <Panel direction="column" padding="0em 0em 1em 0em" width="100%">
            <Separator fontSize="1em">{translation.alternative}</Separator>
        </Panel>
    {/if}

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
            <Link onClick={()=> controller.view = 'recovery'}>
                {translation.forgotPassword}
            </Link>
        </Panel>
        <Panel direction="column" style="align-self: flex-end" height="100%" width="100%"
               padding="1em 0 0 0">
            <Icon fullWidth={true}
                  textCenter={true}
                  onClick={()=> controller.login()} icon="fa">
                {translation.signIn}
            </Icon>
            <Link>
                <Panel onClick={()=>controller.view="register"} padding="1em 0 0 0">
                    <div>
                        Utworz konto
                    </div>
                    <i class="fa fa-user-plus"></i>
                </Panel>
            </Link>
        </Panel>

    </Panel>
</Panel>
