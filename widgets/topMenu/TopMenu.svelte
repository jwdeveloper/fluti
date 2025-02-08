<script lang="ts">
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Link from "$lib/fluti/components/Link.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Grid from "$lib/fluti/components/panel/Grid.svelte";
    import {onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";

    interface TopMenuProps {
        height?: number;
        width?: string;
        logo?: string;
        title?: string;
        treashold?: number
    }

    let {
        height = 90,
        width = "80%",
        logo = 'logo.png',
        title = '',
        treashold = 100
    }: TopMenuProps = $props();

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
    <h1 style="color: var(--accent-primary)">{title}</h1>
{/snippet}

<Grid id="menu-space" width="100%" height="{height}px"/>
<Grid panelType="block" style="position: fixed; width: 100%; top: 0; left: 0; right: 0; z-index: var(--z-index-4);">
    <Grid width="100%"
          bind:element={element}
          background="var(--bg-primary)"
          height='{height}px'>

        <Grid
                panelType="grid"
                columns="auto 1fr auto"
                width={width}>

            <Grid padding="0 1em">
                <Logo/>
            </Grid>
            <Grid width="100%" justify="flex-end">
                <Grid padding="0 1em" justify="space-around" align="center" gap="1em">
                    <Link>
                        <h4>O nas</h4>
                    </Link>
                    <Link>
                        <h4>Cennik</h4>
                    </Link>
                    <Link>
                        <h4>Kontakt</h4>
                    </Link>
                </Grid>
            </Grid>

            <Grid padding="0 1em">
                <Icon icon="fa fa-heart"/>
                <Icon icon="fa fa-user">Konto</Icon>
                <Icon onClick={()=> window.location.href='/login'}>Zaloguj się</Icon>
            </Grid>
        </Grid>
    </Grid>
    <!--    <Separator/>-->
</Grid>
