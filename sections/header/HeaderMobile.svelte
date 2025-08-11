<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties.ts";
    import SideWindow from "$lib/fluti/widgets/window/SideWindow.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import type {HeaderSectionProps} from "$lib/fluti/sections/header/types";
    import LogoElement from "$lib/fluti/sections/common/LogoElement.svelte";
    import {vibrate} from "$lib/fluti/utils/Wait";
    import LeftRightInteraction from "$lib/fluti/components/interaction/LeftRightInteraction.svelte";
    import type {Direction} from "$lib/fluti/flutiSvelteTypes";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";

    let {items, currentPath, ...props}: HeaderSectionProps = $props();

    let openWindow = $state(false)


    function handleItemClick(item: any) {
        vibrate();
        window.location.href = item.link ?? "/"
    }

    function handleInteraction(event: Direction) {
        if (openWindow === false)
            return

        if (event === 'left')
            openWindow = false;
        vibrate();
    }

    let profile = {
        name: "Profil",
        icon: 'fa fa-user',
        link: '/profile'
    }
</script>


{#snippet HeaderButton(item)}
    {@const selected = currentPath === (item?.link ?? false)}
    <Element
            padding="0 0 0 1em"
            width="100%"
            radius={flutiTheme.radius.large}
            background={selected?flutiTheme.background.accent:flutiTheme.background.secondary}
            color={selected?flutiTheme.background.primary:''}
            direction="row"
            onClick={()=>handleItemClick(item)}
            justify="space-between"
            gap="0em">
        <svelte:element this="a"
                        href={item.link??"/"}
                        style="text-warp:no-wrap;"
        >
            {item.name}
        </svelte:element>

        <Button2
                variant='text'
                color={selected?flutiTheme.background.primary:''}
                size="large"
                icon={item.icon}/>

    </Element>
{/snippet}


<Element background={flutiTheme.background.primary}
         columns="auto 1fr auto"
         display="grid"
         fontSize={flutiTheme.font.huge}
         id="Mobile-header"
         padding={flutiTheme.padding.large}
         width="100%">

    <Element>
        <!--        <Button2 size="small" icon="fa fa-arrow-left"></Button2>-->
    </Element>

    <Element width="100%">
        <LogoElement {...props.logo}/>
    </Element>

    <Element justify="flex-end" width="100%">
        <Button2 icon="fa-solid fa-bars" onClick={()=>openWindow = true} size="large" variant="text"/>
    </Element>
</Element>
<LeftRightInteraction
        onInteraction={handleInteraction}
/>
<SideWindow
        animation={{duration:300}}
        bind:visible={openWindow}
        panel={{radius: 'var(--radius-large) 0 0 var(--radius-large)'}} size="80%">
    <Element align="flex-start"
             direction='column'
             height="100%"
             justify="flex-start"
             padding="0 1em"
             width="100%">
        <Space variant="small"/>

        <Element align="flex-start" justify="space-between" width="100%">
            <LogoElement {...props.logo}/>
            <Button2 icon="fa fa-x" onClick={()=>openWindow = false} size="medium" variant="text"/>
        </Element>
        <Element justify="flex-end" width="100%">
            {#if props.showLogin}
                {#if props.isUserLogin}
                    <Hint title="Informacje o koncie">
                        <Button2
                                variant="filled"
                                fullWidth={true}
                                onClick={()=> window.location.href=props.profileUrl ?? "/profile"} icon="fa fa-user">
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
        </Element>
        {#each items as item}
            {@render HeaderButton(item)}
        {/each}

        {@render HeaderButton(profile)}
    </Element>
</SideWindow>

