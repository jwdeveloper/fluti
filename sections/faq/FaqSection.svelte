<script lang="ts">
    import Panel from "../../components/containers/Panel.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {generateFAQSchema} from "./FaqActions";
    import type {FaqPanelProps} from "./FaqPanelTypes";
    import FaqSectionItem from "./FaqSectionItem.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Space from "$lib/fluti/components/space/Space.svelte";

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


<Element color={flutiTheme.color.light} padding="1em 0">
    <h2 style="font-weight: 500;
             line-height: 1em;
            font-size: 3.5em">{messages?.title}</h2>
</Element>
<Space/>
<Panel align="flex-start" padding="1em" gap="0.5em">

    {#each items as item}
        <FaqSectionItem item={item}
                        animation={animation}
                        bind:selected={selected}/>
    {/each}
</Panel>