<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import type {CookiePage} from "$lib/fluti/pages/cookies/cookiePageTypes";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Tabs from "$lib/fluti/components/tabs/Tabs.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import CookieCategory from "$lib/fluti/pages/cookies/banner/CookieCategory.svelte";
    import {categories} from "$lib/fluti/pages/cookies/data";

    let {translations, controller}: CookiePage = $props();

    let tabItems = [
        {name: translations.tabs.aboutCookie, page: AgreementPage},
        {name: translations.tabs.details, page: DetailsPage},
        {name: translations.tabs.agreements, page: AboutCookiePage}
    ]
    let currentTab = $state(tabItems[0])
    let innerPage = $derived.by(() => currentTab.page)

    let handleAcceptAll = () => {
        controller.isOpen = false;
    }

    let categoriesData = $derived.by(() => {
        let result = []
        for (let category of categories) {
            result.push({
                category: category,
                providers: [],
                items: []
            })
        }
        return result;
    });


</script>


{#snippet AgreementPage()}

    <h4>
        Niniejsza strona korzysta z plików cookie
    </h4>

    <p style="font-size: {flutiTheme.font.medium}">
        Wykorzystujemy pliki cookie do spersonalizowania treści i reklam, aby oferować funkcje społecznościowe i
        analizować
        ruch w naszej witrynie. Informacje o tym, jak korzystasz z naszej witryny, udostępniamy partnerom
        społecznościowym,
        reklamowym i analitycznym. Partnerzy mogą połączyć te informacje z innymi danymi otrzymanymi od Ciebie lub
        uzyskanymi podczas korzystania z ich usług.
    </p>

{/snippet}


{#snippet DetailsPage()}
    {#each categoriesData as data}
        <CookieCategory {...data}/>
    {/each}
{/snippet}


{#snippet AboutCookiePage()}
    <p style="font-size: {flutiTheme.font.medium}">
        Pliki cookie (ciasteczka) to małe pliki tekstowe, które mogą być stosowane przez strony internetowe, aby
        użytkownicy
        mogli korzystać ze stron w bardziej sprawny sposób.
    </p>
    <Space/>
    <p style="font-size: {flutiTheme.font.medium}">
        Prawo stanowi, że możemy przechowywać pliki cookie na urządzeniu użytkownika, jeśli jest to niezbędne do
        funkcjonowania niniejszej strony. Do wszystkich innych rodzajów plików cookie potrzebujemy zezwolenia
        użytkownika.
    </p>
    <Space/>
    <p style="font-size: {flutiTheme.font.medium}">
        Niniejsza strona korzysta z różnych rodzajów plików cookie. Niektóre pliki cookie umieszczane są przez usługi
        stron
        trzecich, które pojawiają się na naszych stronach.
    </p>
    <Space/>
    <p style="font-size: {flutiTheme.font.medium}">
        W dowolnej chwili możesz wycofać swoją zgodę w Deklaracji dot. plików cookie na naszej witrynie.
    </p>
    <Space/>
    <p style="font-size: {flutiTheme.font.medium}">
        Dowiedz się więcej na temat tego, kim jesteśmy, jak można się z nami skontaktować i w jaki sposób przetwarzamy
        dane
        osobowe w ramach Polityki prywatności.
    </p>

    <p style="font-size: {flutiTheme.font.medium}">
        Prosimy o podanie identyfikatora Pana(Pani) zgody i daty kontaktu z nami w sprawie Pana(Pani) zgody
    </p>

{/snippet}


<Element width="100%"
         height="100%"
         align="flex-start"
         justify="space-between"
         direction="column">
    <Element justify="flex-end"
             width="100%"
             padding={flutiTheme.padding.large}>
        <h4>Cookiebot</h4>
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
