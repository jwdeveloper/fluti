<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties.ts";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";
    import SideWindow from "$lib/fluti/widgets/window/SideWindow.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";

    let {items} = $props();

    let openWindow = $state(false)
</script>


{#snippet HeaderButton(item)}
    <Panel padding="0.5em 1em"
           width="100%"
           direction="row"
           effects={{
               click:{},
               rippler:{}}}
           onClick={()=> window.location.href = item.link??"/"}
           display="grid"
           columns="auto 1fr"
           gap="1em">
        <Button2
                background={flutiTheme.background.primary}
                icon={item.icon}/>
        <svelte:element this="a"
                        href={item.link??"/"}
                        style="text-warp:no-wrap;"
                        class="menu-item">
            {item.name}
        </svelte:element>
    </Panel>

{/snippet}


<Element width="100%"
         id="Mobile-header"
         display="grid"
         columns="1fr 1fr 1fr"
         fontSize={flutiTheme.font.huge}
         background={flutiTheme.background.primary}
         padding={flutiTheme.padding.large}>

    <div></div>
    <h1 style="color: {flutiTheme.background.accent}">cenograf.pl</h1>
    <Element width="100%" justify="flex-end">
        <Button2 onClick={()=>openWindow = true} icon="fa-solid fa-bars" size="large" variant="text"/>
    </Element>
</Element>

<SideWindow bind:visible={openWindow} size="80%">
    <Element height="100%"
             direction='column'
             width="100%"
             padding="0 1em"
             justify="flex-start"
             align="flex-start">
        <Space variant="small"/>

        <Element width="100%" justify="flex-end">
            <Button2 onClick={()=>openWindow = false} icon="fa fa-x" size="large" variant="text"/>
        </Element>
        <Element width="100%">
            <Separator/>
        </Element>
        <Space/>
        {#each items as item}
            {@render HeaderButton(item)}
        {/each}
    </Element>
</SideWindow>

