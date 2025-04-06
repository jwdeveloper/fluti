<script lang="ts">
    import {getContext, onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import DefaultMenu from "$lib/fluti/widgets/menu/DefaultMenu.svelte";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import {useThemes} from "$lib/fluti/widgets/theme/themeController.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import userSession from "$lib/fluti/server2/middlewares/session/clientUserSession.svelte";

    interface HeaderProps {
        height?: number;
        width?: string;
        logo?: string;
        icon?: string
        title?: string;
        treashold?: number
        addSpace?: boolean
        showLogin?: boolean
        showThemes?: boolean
        items?: any[]
        children?: any[]
    }

    let {
        height = 90,
        width = "85%",
        logo = 'logo.png',
        title = '',
        icon = '',
        treashold = 100,
        addSpace = true,
        items = [],
        showLogin = true,
        showThemes = true,
        children = undefined
    }: HeaderProps = $props();


    let userData = getContext('user')
    let themes = useThemes()
    let themeIcon = $derived.by(() => {

        if (themes.theme === 'dark')
            return 'fa fa-moon'

        return 'fa fa-solid fa-sun'
    })
    let updateTheme = () => {
        if (themes.theme === 'dark')
            themes.setTheme('light')
        else
            themes.setTheme('dark')
    }


    let element: HTMLHtmlElement
    let aElement: any
    let scroll = $state(0)
    let isScrollingDown = $state(false)
    let isOpen = $derived.by(() => {

        if (!isScrollingDown)
            return true;

        return scroll <= treashold;
    })

    onMount(() => {
        aElement = animatedElement(element)
    })

    $effect(() => {
        isOpen
        if (!aElement)
            return

        aElement.height(isOpen ? height + "px" : 0, 300)
        aElement.opacity(isOpen ? 1 : 0, 300)
        return
    })

    function onScroll() {
        let value = document.documentElement.scrollTop || document.body.scrollTop
        isScrollingDown = value > scroll
        scroll = value
    }


</script>

<svelte:window onscroll={onScroll}/>

{#snippet Logo()}
    {#if logo !== ''}
        <img src={logo} alt="logo" style="height: {height-height*0.2}px;"/>
    {/if}

    <i style="font-size: var(--font-size-huge);color: var(--accent-primary)" class="{icon}"></i>
    <h2 style="color: var(--accent-primary)">{title}</h2>

{/snippet}

{#if addSpace}
    <Element id="menu-space" width="100%" height="{height}px"/>
{/if}

<Element
        tag="header"
        display="block" style="position: fixed; width: 100%; top: 0; left: 0; right: 0; z-index: var(--z-index-4);">


    <Element width="100%"
             bind:element={element}
             background="var(--bg-primary)"
             style="box-shadow: 0 0 1em 0.1em var(--shadow)"
             display="grid"
             columns="1fr"
             rows="1fr 1fr"
             direction="column"
             height='{height}px'>


            <Element
                    display="grid"
                    columns="22.5fr 55fr 22.5fr"
                    gap="0"
                    width={width}>

                <Element hover={{style:"cursor:pointer;"}}
                         onClick={()=> window.location.href='/'} padding="0 1em">
                    <Logo/>
                </Element>
                <Element width="100%" justify="center">
                    <DefaultMenu
                            highlightColor={flutiTheme.background.secondary}
                            items={items}/>
                </Element>
                <Element padding="0 1em"
                         justify="flex-start">

                    {#if showLogin}
                        {#if userSession.isLogin}
                            <Hint title="Informacje o koncie">
                                <Button2
                                        variant="filled"
                                        fullWidth={true}
                                        onClick={()=> window.location.href='/profil'} icon="fa fa-user">
                                    Twój profil
                                </Button2>
                            </Hint>
                            <Hint title="Polubione ogłoszenia">
                                <Button2 icon="fa fa-heart  fa-beat"/>
                            </Hint>
                        {:else }
                            <Hint title="Zaloguj się lub utwórz konto">
                                <Button2 variant="filled" onClick={()=> window.location.href='/login'}>
                                    Zaloguj się
                                </Button2>
                            </Hint>

                        {/if}
                    {/if}

                    {#if showThemes}
                        <Hint title="Zmień motyw">
                            <Button2 onClick={updateTheme} icon={themeIcon}/>
                        </Hint>
                    {/if}
                </Element>
            </Element>
    </Element>

</Element>
