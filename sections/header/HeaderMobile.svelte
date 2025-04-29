<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties.ts";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";
    import SideWindow from "$lib/fluti/widgets/window/SideWindow.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import type {HeaderSectionProps} from "$lib/fluti/sections/header/types";
    import LogoElement from "$lib/fluti/sections/common/LogoElement.svelte";

    let {items, currentPath, ...props}: HeaderSectionProps = $props();

    let openWindow = $state(false)

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
            onClick={()=> window.location.href = item.link??"/"}
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
         columns="1fr 1fr 1fr"
         fontSize={flutiTheme.font.huge}
         background={flutiTheme.background.primary}
         padding={flutiTheme.padding.large}>

    <div></div>
    <h1 style="color: {flutiTheme.background.accent}">{props.logo.name}</h1>
    <Element width="100%" justify="flex-end">
        <Button2 onClick={()=>openWindow = true} icon="fa-solid fa-bars" size="large" variant="text"/>
    </Element>
</Element>

<SideWindow
        panel={{radius: 'var(--radius-large) 0 0 var(--radius-large)'}}
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
    </Element>
</SideWindow>

