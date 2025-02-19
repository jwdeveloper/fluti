<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Title from "$lib/fluti/components/title/Title.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";

    export interface SubscriptionCardProps {
        type: string
        price: number
        shortDescription: string
        features: string[]
        popular?: boolean
        currency?: string
    }

    const {
        type = '',
        popular = true,
        price = 0,
        shortDescription = ''
    }: SubscriptionCardProps = $props();
</script>

{#snippet PopularBadge()}
    <Panel style="position: absolute; top:-10px; right: -15px; z-index: var(--z-index-2)">
        <Button2
                variant="filled"
                size="tiny">
            Popularne!
        </Button2>
    </Panel>
{/snippet}


<Panel
        height="100%"
        width="100%"

        direction="column"
        variant="component-panel-border-dark"
        style="position: relative"
        padding="1em">

    {#if popular === true}
        <PopularBadge/>
    {/if}

    <Panel>
        <Title color="light" tag="h2">{type}</Title>
    </Panel>
    <Title color="light">{price}zł/m</Title>
    <h4>{shortDescription}</h4>

    <Panel width="100%">
        <Button2  style="border-radius: 2em">Wybierz</Button2>
    </Panel>
    <Separator/>

</Panel>
