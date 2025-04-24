<script lang="ts">
    import Panel from "../../components/containers/Panel.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {generateFAQSchema} from "./FaqActions";
    import type {FaqPanelProps} from "./FaqPanelTypes";
    import FaqSectionItem from "./FaqSectionItem.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import SectionContainer from "$lib/fluti/sections/SectionContainer.svelte";
    import TitleAndTextElement from "$lib/fluti/sections/common/TitleAndTextElement.svelte";

    let {
        items,
        messages = {
            title: "FAQ - frequent asked questions"
        },
        animation = {
            height: "150px",
            speed: 250
        },
        ...props
    }: FaqPanelProps = $props();


    let selected = $state({})
</script>

<svelte:head>
    {@html generateFAQSchema(items)}
</svelte:head>


<SectionContainer
        height="auto"
        style=""
        mobile={{height:'auto',padding:'1em'}}
        justify="flex-start"
        {...props}
>
<!--    <Element color={flutiTheme.color.light} padding="1em 0">-->
<!--        <h2 style="font-weight: 500;-->
<!--             line-height: 1em;-->
<!--            font-size: 3.5em">{messages?.title}</h2>-->
<!--    </Element>-->
    <TitleAndTextElement
            color={flutiTheme.background.accent}
            subTitle="FAQ - czyli częste pytania"
            title={messages?.title ?? 'FAQ'}/>


    <Space/>
    <Panel align="flex-start" padding="1em" gap="0.5em">

        {#each items as item, index}
            <FaqSectionItem item={item}
                            animation={animation}
                            index={index}
                            bind:selected={selected}/>
        {/each}
    </Panel>
</SectionContainer>
