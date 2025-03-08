<script lang="ts">

    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {
        CookieCategoryData,
        CookieItemData,
        CookieProviderData
    } from "$lib/fluti/pages/cookies/cookiePageTypes";
    import Switch from "$lib/fluti/components/switch/Switch.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";


    interface CookieCategoryProps {
        category: CookieCategoryData
        providers: CookieProviderData[],
        items: CookieItemData[],
    }

    let {category, providers, items}: CookieCategoryProps = $props();
    let isOpen = $state(false);




</script>

{#snippet TopElement()}
    <Element
            effects={{rippler:{color:flutiTheme.background.shadow}}}
            padding={flutiTheme.padding.large}
            radius={flutiTheme.radius.medium}
            width="100%">
        <Element direction="column" width="100%" style="z-index: 1">

            <Element justify="space-between"
                     width="100%">
                <Element>
                    <i class="fa fa-arrow-down"></i>
                    <h4>
                        {category.title}
                    </h4>
                </Element>
                <Switch/>
            </Element>
            <p style="font-size: var(--font-size-medium)">
                {category.description}
            </p>
        </Element>

    </Element>
{/snippet}


<Element>

    <TopElement/>
    {#if isOpen}
        <Element>

        </Element>
    {/if}
</Element>
<Space variant="small"/>
