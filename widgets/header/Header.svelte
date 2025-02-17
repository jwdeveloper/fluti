<script lang="ts">
    import {getContext, onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import {useUserSession} from "$lib/fluti/services/userSessionController.svelte";
    import DefaultMenu from "$lib/fluti/widgets/menu/DefaultMenu.svelte";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import {useThemes} from "$lib/fluti/widgets/theme/themeController.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    interface TopMenuProps {
        height?: number;
        width?: string;
        logo?: string;
        title?: string;
        treashold?: number
        addSpace?: boolean
    }

    let {
        height = 90,
        width = "85%",
        logo = 'logo.png',
        title = '',
        treashold = 100,
        addSpace = true
    }: TopMenuProps = $props();


    let userData = getContext('user')
    let themes = useThemes()
    let themeIcon = $derived.by(() => {

        if (themes.theme === 'dark-1')
            return 'fa fa-moon'

        return 'fa fa-solid fa-sun'
    })
    let updateTheme = () => {
        if (themes.theme === 'dark-1')
            themes.setTheme('light-1')
        else
            themes.setTheme('dark-1')
    }

    let session = useUserSession()
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


    const defaultItems = [
        {
            name: 'Wyszukiwarka',
            link: '/'
        },
        {
            name: 'Cennik',
            link: '/prices'
        },
        {
            name: 'Statystyki',
            link: '/profile'
        },
        {
            name: 'O nas',
            link: '/about'
        }]
</script>

<svelte:window onscroll={onScroll}/>

{#snippet Logo()}
    {#if logo !== ''}
        <img src={logo} alt="logo" style="height: {height-height*0.2}px;"/>
    {/if}

    <i style="font-size: 3em;color: var(--accent-primary)" class="fa fa-line-chart"></i>
    <h1 style="color: var(--accent-primary)">{title}</h1>

{/snippet}

{#if addSpace}
    <Element id="menu-space" width="100%" height="{height}px"/>
{/if}

<Element
        tag="header"
        display="block" style="position: fixed; width: 100%; top: 0; left: 0; right: 0; z-index: var(--z-index-5);">
    <Element width="100%"
             bind:element={element}
             background="var(--bg-primary)"
             style="box-shadow: 0 0 1em 0.1em var(--shadow)"
             height='{height}px'>

        <Element
                display="grid"
                columns="22.5fr 55fr 22.5fr"
                width={width}>

            <Element hover={{style:"cursor:pointer;"}}
                     onClick={()=> window.location.href='/'} padding="0 1em">
                <Logo/>
            </Element>
            <Element width="100%" justify="center">
                <DefaultMenu items={defaultItems}/>
            </Element>
            <Element padding="0 1em"
                     justify="flex-start">
                {#if session.isLogin}
                    <Hint title="Informacje o koncie">
                        <Button2
                                fullWidth={true}
                                onClick={()=> window.location.href='/profile'} icon="fa fa-user">
                            Konto
                        </Button2>
                    </Hint>
                    <Hint title="Polubione ogłoszenia">
                        <Button2 icon="fa fa-heart  fa-beat"/>
                    </Hint>
                {:else }
                    <Button2 onClick={()=> window.location.href='/login'}>
                        Zaloguj się
                    </Button2>
                {/if}

                <Hint title="Zmień motyw">
                    <Button2 variant="filled" onClick={updateTheme} icon={themeIcon}/>
                </Hint>
            </Element>

        </Element>


    </Element>
</Element>
