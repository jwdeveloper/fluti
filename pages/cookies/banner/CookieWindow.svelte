<script lang="ts">
    import SideWindow from "$lib/fluti/widgets/window/SideWindow.svelte";
    import {
        type CookieWindowControllerSvelte,
        useCookieWindow
    } from "$lib/fluti/pages/cookies/cookieWindowController.svelte";
    import CookieBanner from "$lib/fluti/pages/cookies/banner/CookieBanner.svelte";
    import type {CookiePage} from "$lib/fluti/pages/cookies/cookiePageTypes";

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

</script>


<SideWindow
        height="50vh"
        size="50vw"
        allowClose={false}
        animation={{direction:'center'}}
        bind:visible={controller.isOpen}>
    <CookieBanner {...page} controller={controller}/>
</SideWindow>