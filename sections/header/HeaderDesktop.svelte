<script lang="ts">
    import {getContext, onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import DefaultMenu from "$lib/fluti/widgets/menu/DefaultMenu.svelte";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import {useThemes} from "$lib/fluti/widgets/theme/themeController.svelte.js";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import type {HeaderSectionProps} from "$lib/fluti/sections/header/types";
    import CompanyInfo from "$lib/fluti/sections/header/components/CompanyInfo.svelte";
    import LogoElement from "$lib/fluti/sections/common/LogoElement.svelte";

    let {
        height = 90,
        width = "85%",
        logo,
        title = '',
        currentPath,
        icon = '',
        treashold = 100,
        addSpace = true,
        items = [],
        showLogin = true,
        hideAfterScroll = true,
        showThemes = true,
        profileUrl = 'profile',
        isUserLogin = false,
        children = undefined,
        ...props
    }: HeaderSectionProps = $props();

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

    let elementHeight: number = $state(height)
    onMount(() => {
        aElement = animatedElement(element)
        elementHeight = element.getBoundingClientRect().height;
    })

    $effect(() => {
        isOpen
        if (!aElement)
            return

        if (!hideAfterScroll)
            return;

        // return;
        aElement.height(isOpen ? elementHeight + "px" : 0, 300)
        aElement.opacity(isOpen ? 1 : 0, 200)
        return
    })

    function onScroll() {
        let value = document.documentElement.scrollTop || document.body.scrollTop
        isScrollingDown = value > scroll
        scroll = value
    }
</script>

<svelte:window onscroll={onScroll}/>


{#if addSpace}
    <Element id="menu-space"
             background={props?.background}
             width="100%" height="{height}px"/>
{/if}

<Element
        display="block" style="position: fixed; width: 100%; top: 0; left: 0; right: 0; z-index: var(--z-index-4);"
        tag="header">


    <Element background={flutiTheme.background.primary}
             bind:element={element}
             direction="column"
             gap="0"
             height="auto"
             style="box-shadow: 0 0 1em 0.1em var(--shadow)"
             width="100%">

        {#if props.companyInfo}
            <CompanyInfo
                    padding={props.padding}
                    {...props.companyInfo}/>
        {/if}

        <Element
                columns="22.5fr 55fr 22.5fr"
                display="grid"

                gap="0"
                padding='1em {props.padding}'
                width="100%"
        >

            <Element
                    hover={{style:"cursor:pointer;"}}
                    justify="flex-start"
                    onClick={()=> window.location.href='/'}>
                <LogoElement {...logo}/>
            </Element>
            <Element

                    justify="center" width="100%">
                <DefaultMenu
                        currentItemKey={currentPath}
                        highlightColor={flutiTheme.background.secondary}
                        items={items}/>
            </Element>
            <Element
                    justify="flex-end">

                {#if showLogin}
                    {#if isUserLogin}
                        <Hint title="Informacje o koncie">
                            <Button2
                                    variant="filled"
                                    fullWidth={true}
                                    onClick={()=> window.location.href=profileUrl} icon="fa fa-user">
                                Twój profil
                            </Button2>
                        </Hint>

                    {:else }
                        <Hint title="Zaloguj się lub utwórz konto">
                            <Button2 variant="filled" onClick={()=> window.location.href='/login'}>
                                Zaloguj się
                            </Button2>
                        </Hint>
                    {/if}
                {/if}
                <Hint title="Ulubione">
                    <Button2 icon="fa fa-heart  fa-beat"/>
                </Hint>
                {#if showThemes}
                    <Hint title="Zmień motyw">
                        <Button2 onClick={updateTheme} icon={themeIcon}/>
                    </Hint>
                {/if}
            </Element>
        </Element>
    </Element>

</Element>
