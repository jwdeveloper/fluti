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
        link:'/profile'
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


<Element width="100%"
         id="Mobile-header"
         display="grid"
         columns="auto 1fr auto"
         fontSize={flutiTheme.font.huge}
         background={flutiTheme.background.primary}
         padding={flutiTheme.padding.large}>

    <Element>
        <!--        <Button2 size="small" icon="fa fa-arrow-left"></Button2>-->
    </Element>

    <Element width="100%">
        <LogoElement {...props.logo}/>
    </Element>

    <Element width="100%" justify="flex-end">
        <Button2 onClick={()=>openWindow = true} icon="fa-solid fa-bars" size="large" variant="text"/>
    </Element>
</Element>
<LeftRightInteraction
        onInteraction={handleInteraction}
/>
<SideWindow
        panel={{radius: 'var(--radius-large) 0 0 var(--radius-large)'}}
        animation={{duration:300}}
        bind:visible={openWindow} size="80%">
    <Element height="100%"
             direction='column'
             width="100%"
             padding="0 1em"
             justify="flex-start"
             align="flex-start">
        <Space variant="small"/>

        <Element width="100%" justify="space-between" align="flex-start">
            <LogoElement {...props.logo}/>
            <Button2 onClick={()=>openWindow = false} icon="fa fa-x" size="medium" variant="text"/>
        </Element>
        <Element width="100%">
        </Element>
        {#each items as item}
            {@render HeaderButton(item)}
        {/each}

        {@render HeaderButton(profile)}
    </Element>
</SideWindow>

