<script lang="ts">
    import Panel from "../../components/containers/Panel.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {generateFAQSchema} from "./FaqActions";
    import type {FaqPanelProps} from "./FaqPanelTypes";
    import FaqPanelItem from "./FaqPanelItem.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

    let {
        items,
        messages = {
            title: "FAQ - frequent asked questions"
        },
        animation = {
            height: "150px",
            speed: 250
        }
    }: FaqPanelProps = $props();


    let selected = $state({})
</script>

<svelte:head>
    {@html generateFAQSchema(items)}
</svelte:head>


<Element color={flutiTheme.color.light} padding="1em">
    <h1>{messages?.title}</h1>
</Element>

<Panel align="flex-start" padding="1em" gap="0.5em">

    {#each items as item}
        <FaqPanelItem item={item}
                      animation={animation}
                      bind:selected={selected}/>
    {/each}
</Panel>