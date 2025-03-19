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
                tabs: {
                    agreements: "Agreements",
                    details: "Details",
                    aboutCookie: "About cookies"
                }
            }
        }
    }: CookieWindowProps = $props();

    onMount(()=>
    {
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
<div class="bg-gray-100 py-6 flex flex-col justify-center sm:py-12 z-50">

    <div>
<!--          x-transition:enter-start="opacity-0 scale-90"-->
<!--          x-transition:enter="transition duration-200 transform ease"-->
<!--          x-transition:leave="transition duration-200 transform ease"-->
<!--          x-transition:leave-end="opacity-0 scale-90"-->
<!--          class="max-w-screen-lg mx-auto fixed bg-white inset-x-5 p-5 bottom-40 rounded-lg drop-shadow-2xl flex gap-4 flex-wrap md:flex-nowrap text-center md:text-left items-center justify-center md:justify-between">-->
        <div class="w-full">This website uses cookies to ensure you get the best experience on our website.
            <a href="#" class="text-indigo-600 whitespace-nowrap  hover:underline">Learn more</a></div>
        <div class="flex gap-4 items-center flex-shrink-0">
            <!-- setTimeout is for demo purposes only. Remove it & add to cookies
                 so that the popup won't appear next time they load. -->
            <Button2 onClick={toggleBanner}>Decline</Button2>
            <Button2 onClick={toggleBanner}>Allow Coockies</Button2>
        </div>
    </div>

</div>
{/if}