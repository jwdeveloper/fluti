<script lang="ts">
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Link from "$lib/fluti/components/Link.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Grid from "$lib/fluti/components/panel/Grid.svelte";
    import {onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import {useUserSession} from "$lib/fluti/services/userSessionController.svelte";
    import DefaultMenu from "$lib/fluti/widgets/menu/DefaultMenu.svelte";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import {useThemes} from "$lib/fluti/widgets/theme/themeController.svelte";

    interface TopMenuProps {
        height?: number;
        width?: string;
        logo?: string;
        title?: string;
        treashold?: number
    }

    let {
        height = 90,
        width = "100%",
        logo = 'logo.png',
        title = '',
        treashold = 100
    }: TopMenuProps = $props();

    let themes = useThemes()
    let themeIcon = $derived.by(() => {

        if (themes.theme !== 'dark-1')
            return 'fa fa-moon'

        return 'fa fa-solid fa-sun'
    })
    let updateTheme = () => {
        if (themes.theme === 'dark-1')
            themes.setTheme('light-cenograf')
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

</script>

<svelte:window onscroll={onScroll}/>

{#snippet Logo()}
    {#if logo !== ''}
        <img src={logo} alt="logo" style="height: {height-height*0.2}px;"/>
    {/if}

    <i style="font-size: 3em;color: var(--accent-primary)" class="fa fa-line-chart"></i>
    <h1 style="color: var(--accent-primary)">{title}</h1>
{/snippet}

<Grid id="menu-space" width="100%" height="{height}px"/>
<Grid panelType="block" style="position: fixed; width: 100%; top: 0; left: 0; right: 0; z-index: var(--z-index-4);">
    <Grid width="100%"
          bind:element={element}
          background="var(--bg-primary)"
          style="box-shadow: 0 0 1em 0.1em var(--shadow)"
          height='{height}px'>

        <Grid
                panelType="grid"
                columns="22.5fr 55fr 22.5fr"
                width={width}>

            <Grid
                    hover={{style:"cursor:pointer;"}}
                    onClick={()=> window.location.href='/'} padding="0 1em">
                <Logo/>
            </Grid>
            <Grid width="100%" justify="flex-end">
                <DefaultMenu/>
                <Grid padding="0 1em">
                    {#if session.isLogin}
                        <Hint title="Polubione ogłoszenia">
                            <Icon icon="fa fa-heart  fa-beat"/>
                        </Hint>
                        <Icon onClick={()=> window.location.href='/profile'} icon="fa fa-user">Konto</Icon>
                    {:else }
                        <Icon onClick={()=> window.location.href='/login'}>Zaloguj się</Icon>
                    {/if}
                </Grid>
            </Grid>

            <Grid padding="0 5em" justify="flex-end">
                <Hint title="Zmień motyw">
                    <Icon onClick={updateTheme} icon={themeIcon}/>
                </Hint>
            </Grid>
        </Grid>
    </Grid>
</Grid>
