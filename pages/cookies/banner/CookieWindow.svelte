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
                whatAreCookies: "What are cookies",
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
{#if controller.isOpenBanner && !controller.isOpen}

    <div style="
     height: 100%;
     width: 30%;

     position: fixed;
     display: flex;
     align-items: flex-end;
     pointer-events: none;
     justify-content: flex-end;
     z-index: var(--z-index-5)
">

        <Panel
                mobile={{
                    columns:"1fr",
                    rows:"1fr auto",
                }}
                display="grid"
                style="border: 1px solid var(--accent-primary); pointer-events: all"
                columns="1fr auto"
                padding="1.5em 10%"
                >

            <Element
                     align="flex-start"
                     direction="column">

                <Element  justify="flex-start">
                    <h3>{page.translations.whatAreCookies}</h3>
                </Element>
                <p>
                    {page.translations.shortDescription} 🍪
                    <a href="https://www.cloudflare.com/pl-pl/learning/privacy/what-are-cookies/"
                       class="text-indigo-600 whitespace-nowrap  hover:underline">{page.translations.whatAreCookies}</a>
                </p>
                <Element>
                    <Button2 onClick={()=>controller.handleEditCookiesClick()}> {page.translations.customize}</Button2>
                    <Button2 onClick={()=>controller.handleSaveClick({})}
                             variant="filled">{page.translations.acceptAll}</Button2>
                </Element>
            </Element>
        </Panel>

    </div>
{/if}