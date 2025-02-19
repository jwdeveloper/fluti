<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Title from "$lib/fluti/components/title/Title.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Space from "$lib/fluti/components/space/Space.svelte";

    export interface SubscriptionCardProps {
        id?: string
        name?: string
        description?: string
        price?: number
        features?: string[]
        popular?: boolean
        currency?: string
        meta?: {
            badge?: string
        }
        onClick?: (variant: string) => void
    }

    const {
        id = '',
        name = '',
        popular = true,
        price = 0,
        description = '',
        features = [],
        onClick = () => {
        },
        ...props
    }: SubscriptionCardProps = $props();
</script>

{#snippet PopularBadge(text)}
    <Element
            padding="0.1em 0.6em"
            radius={flutiTheme.radius.medium}
            fontSize={flutiTheme.font.small}
            background={flutiTheme.background.accent}
            color={flutiTheme.color.accent}>
        {text}
    </Element>
{/snippet}


<Element
        height="100%"
        width="100%"
        direction="column"
        gap="0.8em"

        background={flutiTheme.background.primary}
        radius={flutiTheme.radius.large}
        style="position: relative; border:{props?.meta?.badge?'2px solid var(--accent-primary)':''} "
        padding="1.5em">


    <Element direction="column"
             gap="0"
             width="100%"
             justify="flex-start"
             align="flex-start">
        <Element>
            <h3>{name}</h3>
            {#if props?.meta?.badge}
                {@render PopularBadge(props?.meta?.badge)}
            {/if}
        </Element>
        <h4 style="font-weight: normal">Dla użytkowników</h4>
    </Element>
    <Element width="100%" justify="flex-start">
        <Title color="light">{props.prices[0].price}zł/m</Title>
    </Element>

    <Element direction="column" width="100%">
        <Button2 fullWidth={true}
                 disabled={props.prices[0].price == 0}
                 variant={!props?.meta?.badge?'outline':"filled"}
                 onClick={()=>onClick(id)}
                 style="border-radius: 2em;font-weight: bold; margin-top: 0.5em">
            Wybierz
        </Button2>
    </Element>
    <Space/>

    <Element direction="column" align="flex-start" width="100%">
        {#each features as feature}
            <h5 style="font-weight: normal">{feature.name}</h5>
        {/each}
    </Element>
    <Element width="100%" height="100%" align="flex-end" justify="flex-end">
    </Element>

</Element>
