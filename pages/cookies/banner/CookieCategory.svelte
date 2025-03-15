<script lang="ts">

    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Switch from "$lib/fluti/components/switch/Switch.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import type {CookieCategoryProps} from "$lib/fluti/pages/cookies/cookiePageTypes";


    let {
        category,
        providers,
        items,
        isEnabled = $bindable(false)
    }: CookieCategoryProps = $props();

    let isOpen = $state(false)
    let icon = $derived.by(() => {
        return !isOpen ? 'fa-arrow-down' : 'fa-arrow-up';
    })


</script>

{#snippet TopElement()}
    <Element
            effects={{rippler:{color:flutiTheme.background.shadow}}}
            padding={flutiTheme.padding.large}
            radius={flutiTheme.radius.medium}
            onClick={()=> isOpen = !isOpen}
            width="100%">
        <Element direction="column" width="100%" style="z-index: 1">

            <Element justify="space-between"
                     width="100%">
                <Element>
                    <i class="fa {icon}"></i>
                    <h4>
                        {category.title}
                    </h4>
                </Element>
                <Switch bind:value={isEnabled}/>
            </Element>
            <p style="font-size: var(--font-size-medium)">
                {category.description}
            </p>
        </Element>
    </Element>
{/snippet}


{#snippet ItemsElement(item)}
    <Element
            padding={flutiTheme.padding.large}
            radius={flutiTheme.radius.medium}
            justify="flex-start"
            width="100%">
        <Element direction="column"
                 align="flex-start"
                 width="100%" style="z-index: 1">
            <Element justify="flex-start" width="100%">
                <h4>
                    {item.title}
                </h4>
                by
                <h4>
                    {item.providerId}
                </h4>
            </Element>
            <p style="font-size: var(--font-size-medium)">
                {item.description}
            </p>
        </Element>
    </Element>
{/snippet}

<Element display="grid" direction="column">
    <Separator margin="0"/>
    <TopElement/>
    <Element height="auto" width="100%" direction="column" background={flutiTheme.background.transparent}>
        {#if isOpen}
            {#each items as item}
                {@render ItemsElement(item)}
            {/each}
        {/if}
    </Element>
</Element>
<Space variant="small"/>
