<script lang="ts">
    import SideWindow from "$lib/fluti/widgets/window/SideWindow.svelte";
    import {
        type CookieWindowControllerSvelte,
        useCookieWindow
    } from "$lib/fluti/pages/cookies/cookieWindowController.svelte";
    import CookieBanner from "$lib/fluti/pages/cookies/banner/CookieBanner.svelte";
    import type {CookiePage} from "$lib/fluti/pages/cookies/cookiePageTypes";
    import {onMount} from "svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";

    interface CookieWindowProps {
        controller?: CookieWindowControllerSvelte
        page?: CookiePage
        window?: any
    }

    let {
        controller = useCookieWindow(),
        page = {
            translations: {
                title: 'cookiebot',
                acceptAll: "Accept and save",
                customize: "Customize",
                whatAreCookies:"What are cookies",
                shortDescription: "This website uses cookies to ensure you get the best experience on our website.",
                tabs: {
                    agreements: "Agreements",
                    details: "Details",
                    aboutCookie: "About cookies"
                }
            }
        }
    }: CookieWindowProps = $props();

    onMount(() => {
        controller.openCookiesWindow();
    })

    let showBanner = $state(true);

    function toggleBanner() {
        showBanner = !showBanner;
    }
</script>


<SideWindow
        height="50vh"
        size="50vw"
        allowScroll={false}
        allowClose={false}
        animation={{direction:'center'}}
        bind:visible={controller.isOpen}>
    <CookieBanner {...page} controller={controller}/>
</SideWindow>
{#if showBanner}

    <div style="
    position: fixed; height: 100%;
     display: flex;
     align-items: flex-end;
     pointer-events: none;
     justify-content: flex-end;
     width: 100%; z-index: var(--z-index-5)">

        <Panel
                display="grid"
                style="border-top: 1px solid var(--accent-primary); pointer-events: all"
                columns="1fr auto"
                radius="0"
                padding="1.5em 2em"
                width="100%">
            <div>
                {page.translations.shortDescription} 🍪
                <a href="https://www.cloudflare.com/pl-pl/learning/privacy/what-are-cookies/"
                   class="text-indigo-600 whitespace-nowrap  hover:underline">{page.translations.whatAreCookies}</a>
            </div>
            <div class="flex gap-4 items-center flex-shrink-0">
                <Button2 onClick={toggleBanner}> {page.translations.customize}</Button2>
                <Button2 onClick={toggleBanner} variant="filled">{page.translations.acceptAll}</Button2>
            </div>
        </Panel>

    </div>
{/if}