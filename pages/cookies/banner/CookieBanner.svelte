<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import type {CookieCategoryData, CookieItemData, CookiePage} from "$lib/fluti/pages/cookies/cookiePageTypes";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Tabs from "$lib/fluti/components/tabs/Tabs.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import CookieCategory from "$lib/fluti/pages/cookies/banner/CookieCategory.svelte";
    import {categories, providers} from "$lib/fluti/pages/cookies/data";
    //@ts-ignore
    import agreement from "../data/Agreement.md";
    //@ts-ignore
    import about from "../data/About.md";
    import snarkdown from "snarkdown";


    let {translations, controller}: CookiePage = $props();

    let tabItems = [
        {name: translations.tabs.aboutCookie, page: AgreementPage},
        {name: translations.tabs.details, page: DetailsPage},
        {name: translations.tabs.agreements, page: AboutCookiePage}
    ]
    let currentTab = $state(tabItems[0])
    let innerPage = $derived.by(() => currentTab.page)
    let categoriesData = $state(prepareDataModel());

    function prepareDataModel() {
        let result = []
        for (let category of categories) {

            let resultProviders: CookieCategoryData[] = []
            let resultItems: CookieItemData[] = []

            providers
                .filter(pr => pr.items.filter(e => e.categoryType === category.type).length > 0)
                .forEach(pr => {
                    resultProviders.push(pr);
                    resultItems = pr.items.filter(e => e.categoryType === category.type);
                })

            result.push({
                category: category,
                providers: resultProviders,
                items: resultItems,
                isEnabled: true
            })
        }
        return result;
    }

    let handleAcceptAll = () => {
        let data = $state.snapshot(categoriesData);
        controller.handleSaveClick(data);
    }


    const agreementValue = snarkdown(agreement);
    const aboutValue = snarkdown(about);
</script>


{#snippet AgreementPage()}
    {@html agreementValue}
{/snippet}

{#snippet AboutCookiePage()}
    {@html aboutValue}
{/snippet}


{#snippet DetailsPage()}
    {#each categoriesData as data}
        <CookieCategory
                category={data.category}
                providers={data.providers}
                items={data.items}
                bind:isEnabled={data.isEnabled}/>
    {/each}
{/snippet}


<Element width="100%"
         height="100%"
         align="flex-start"
         justify="space-between"
         direction="column">
    <Element justify="flex-end"
             width="100%"
             padding={flutiTheme.padding.large}>
        <h4>{translations.title}</h4>
    </Element>
    <Element width="100%" direction="column">
        <Separator/>
        <Tabs radius="0" bind:selectedItem={currentTab} items={tabItems}/>
        <Separator/>
    </Element>

    <Element direction="column"
             align="flex-start"
             justify="flex-start"
             height="100%"
             padding={flutiTheme.padding.large}
             overflow="scroll"
             width="100%">
        {@render innerPage()}
    </Element>

    <Element width="100%" gap="0" direction="column">

        <Separator/>
        <Element width="100%"
                 padding={flutiTheme.padding.large}
                 justify="flex-end">
            <Button2
                    radius={flutiTheme.radius.small}
                    style="border-color: {flutiTheme.background.accent}"
                    onClick={()=> currentTab= tabItems[1]}
                    width="200px">
                {translations.customize}
            </Button2>
            <Button2
                    radius={flutiTheme.radius.small}
                    onClick={handleAcceptAll}
                    width="200px" variant="filled">
                {translations.acceptAll}
            </Button2>
        </Element>
    </Element>

</Element>
