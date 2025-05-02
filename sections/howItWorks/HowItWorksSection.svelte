<script lang="ts">
    import SectionContainer from "$lib/fluti/sections/SectionContainer.svelte";
    import type {HowItWorksSectionProps} from "$lib/fluti/sections/howItWorks/types";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import StepCard from "$lib/fluti/sections/howItWorks/StepCard.svelte";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";
    import TitleAndTextElement from "$lib/fluti/sections/common/TitleAndTextElement.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

    let props: HowItWorksSectionProps = $props();
</script>

{#snippet TopSection()}
    <Element width="100%"
             align="flex-start"
             height="auto"
             justify="flex-start"
             direction="column"
    >
        <TitleAndTextElement
                color={flutiTheme.background.accent}
                subTitle={props?.subtitle}
                textWidth={breakpoints.isMobile?"100%":"50%"}
                title={props?.title}
                text={props?.summary}
        />
    </Element>
{/snippet}


<SectionContainer
        align="flex-end"
        justify="flex-start"
        direction="column"
        style="min-height: auto"
        {...props}>
    {@render TopSection()}
    <Space/>
    <Panel width="100%"
           align="flex-start"
           padding="0.5em"
           display="grid"
           mobile={{
                 padding:"0",
                 rows:'1fr 1fr 1fr', columns:'1fr'}}
           columns="1fr 1fr 1fr"
           height="100%">
        {#each props.steps as step, index}
            <StepCard index={index} item={step}/>
        {/each}
    </Panel>


</SectionContainer>