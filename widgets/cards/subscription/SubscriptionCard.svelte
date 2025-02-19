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
        prices?: number
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
        prices = [],
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
            <h3 style="color: {flutiTheme.color.light}">{name}</h3>
            {#if props?.meta?.badge}
                {@render PopularBadge(props?.meta?.badge)}
            {/if}
        </Element>
        <h4 style="font-weight: normal">Dla użytkowników</h4>
    </Element>
    <Element gap="0.1em" width="100%" justify="flex-start" align="flex-end">
        <h1 style="line-height: 1.2em; color: {flutiTheme.color.light}">{props.prices[0].price}</h1>
        <h3>zł/m</h3>
    </Element>

    <Element direction="column" width="100%">
        <Button2 fullWidth={true}
                 effects={{click:{

                 }}}
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
            <li style="font-weight: normal; font-size: 0.9em">{feature.name}</li>
            <Space variant="tiny"/>
        {/each}
    </Element>
    <Element width="100%" height="100%" align="flex-end" justify="flex-end">
    </Element>

</Element>
