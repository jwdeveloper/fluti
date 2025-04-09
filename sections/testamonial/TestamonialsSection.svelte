<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {TestamonialSectionProps} from "$lib/fluti/sections/testamonial/types";
    import {exampleTestamonials} from "$lib/fluti/sections/testamonial/exampleData";
    import TestamonialElement from "$lib/fluti/sections/testamonial/TestamonialElement.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import SectionContainer from "$lib/fluti/sections/SectionContainer.svelte";

    let {
        items = exampleTestamonials(),
        title = 'Customer testamonials',
        subtitle = 'Customer testamonials',
        testamonialsProps,
        testamonialTemplate,
        ...props
    }: TestamonialSectionProps = $props();
</script>


<SectionContainer {...props}>


    <Element width="100%" direction="column" align="flex-start">
        <h1 style="font-weight: 500; font-size: 4em">{title}</h1>
        <h4 style="font-weight: 400; font-size: 1.8em; margin-left: 0.2em">{subtitle}</h4>
    </Element>


    <Element width="100%" display="grid"
             gap="5%"
             mobile={{columns:'1fr', rows:'1fr 1fr 1fr' }}
             columns="1fr 1fr 1fr"
             {...testamonialsProps}
    >

        {#each items as item, index}
            {#if testamonialTemplate}
                <svelte:component this={testamonialTemplate} item={item}/>
            {:else}
                <TestamonialElement
                        index={index}
                        item={item}/>
            {/if}
        {/each}
    </Element>
    <Space/>
</SectionContainer>



