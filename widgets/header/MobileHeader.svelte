<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties.ts";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";

    let {items} = $props();

</script>


{#snippet HeaderButton(item)}
    <Element
            gap="0"
            direction="column">
        <Button2
                background={flutiTheme.background.primary}
                onClick={()=> window.location.href = item.link??"/"}
                icon={item.icon}/>
        <svelte:element this="a"
                        href={item.link??"/"}
                        style="text-warp:no-wrap;"
                        class="menu-item">
            <!--{item.name}-->
        </svelte:element>
    </Element>

{/snippet}

<Element height="100%"
         width="100%" style="
      min-height: 100vh;
 position: fixed;
 bottom: 0;
 left:0;
 overflow: hidden;
 pointer-events: none;
 z-index: var(--z-index-4)">


    <Panel width="100%"
           padding="1em 0"
           gap="1em"
           direction="row"
           justify="space-around"
           style="position: absolute; pointer-events: all; bottom: 0"
           background={flutiTheme.background.primary}>

        {#each items as item}
            {@render HeaderButton(item)}
        {/each}
    </Panel>

</Element>
