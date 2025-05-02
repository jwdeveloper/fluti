<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {TestamonialSectionProps} from "$lib/fluti/sections/testamonial/types";
    import {exampleTestamonials} from "$lib/fluti/sections/testamonial/exampleData";
    import TestamonialElement from "$lib/fluti/sections/testamonial/TestamonialElement.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import SectionContainer from "$lib/fluti/sections/SectionContainer.svelte";
    import {onMount} from "svelte";
    import {range} from "$lib/fluti/utils/range";
    import {createReviewSchemaScriptTag} from "$lib/fluti/sections/testamonial/schemaJson";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import TitleAndTextElement from "$lib/fluti/sections/common/TitleAndTextElement.svelte";

    let {
        items = exampleTestamonials(),
        title = 'Customer testamonials',
        subtitle = 'Customer testamonials',
        testamonialsProps,
        testamonialTemplate,
        ...props
    }: TestamonialSectionProps = $props();

    let pos = $state(5)
    onMount(() => {
        setInterval(() => {
            pos += 0.015;
        }, 10)
    })

</script>

<svelte:head>
    {@html createReviewSchemaScriptTag(items, title, subtitle)}
</svelte:head>

<SectionContainer {...props}>


    <Element width="100%" direction="column" align="flex-start">
        <TitleAndTextElement
                color={flutiTheme.background.accent}
                subTitle={subtitle}
                textWidth="50%"
                title={title}
        />
    </Element>
    <div class="move-element"
    >
        {#each range(2) as _}
            {#each items as item, index}
                {#if testamonialTemplate}
                    <svelte:component this={testamonialTemplate} item={item}/>
                {:else}
                    <TestamonialElement index={index} item={item}/>
                {/if}
            {/each}
        {/each}
    </div>

    <Space/>
</SectionContainer>


<style>

    .move-element::after {
        background: red;
        position: absolute;
        height: 100px;
        width: 100%;
        z-index: 1;
    }

    .move-element {
        --duplicates: 3;
        position: relative;
        --scroll-duration: 30s;
        --gap: 1em;
        --offset: calc(var(--gap) / var(--duplicates));
        --move-initial: 0%;
        --move-final: calc(-1 * 100% / var(--duplicates) - var(--offset));
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: var(--gap);
        inline-size: max-content;
        width: max-content;

        animation: scroll-left 60s linear infinite;
    }

    @keyframes scroll-left {
        0% {
            transform: translateX(-5%);
        }
        100% {
            transform: translateX(-50%);
        }
    }
</style>

