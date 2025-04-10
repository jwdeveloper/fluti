<script lang="ts">
    import SectionContainer from "$lib/fluti/sections/SectionContainer.svelte";
    import type {HowItWorksSectionProps} from "$lib/fluti/sections/howItWorks/types";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import StepCard from "$lib/fluti/sections/howItWorks/StepCard.svelte";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";

    let props: HowItWorksSectionProps = $props();
</script>

{#snippet TopSection()}
    <Element width="100%"
             align="flex-start"
             height="auto"
             justify="flex-start"
             direction="column"
    >
        <Element
                width="100%"
                direction="column"
                align="flex-start">

            <h5 style="font-weight: 100;
             font-size: 1.2em;
             line-height: .5em;
             margin-left: 0.2em">
                {props?.subtitle}
            </h5>
            <Space variant="small"/>
            <h1 style="font-weight: 500;
             line-height: 1em;
            font-size: 3.5em">{props?.title}</h1>
        </Element>

        <Space variant="small"/>
        <Element width="50%">
            <h3 style="font-weight: normal">{props?.summary}</h3>
        </Element>
    </Element>
{/snippet}


<SectionContainer
        justify="flex-start"
        style="min-height: auto"
        {...props}>
    <Space/>
    {@render TopSection()}
    <Space/>
    <Element width="100%"
             align="flex-start"
             display="grid"
             mobile={{rows:'1fr 1fr 1fr', columns:'1fr'}}
             gap="2em"
             columns="1fr 1fr 1fr"
             height="100%">
        {#each props.steps as step, index}
            <StepCard index={index} item={step}/>
        {/each}
    </Element>


</SectionContainer>