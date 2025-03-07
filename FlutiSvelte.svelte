<script lang="ts">
    import ThemeManager from "$lib/fluti/widgets/theme/ThemeManager.svelte";
    import AlertManager from "$lib/fluti/widgets/alert/AlertManager.svelte";
    import WindowManager from "$lib/fluti/widgets/window/WindowManager.svelte";
    import BreakpointManager from "$lib/fluti/widgets/breakpoints/BreakpointManager.svelte";
    import UserManager from "$lib/fluti/widgets/user/UserManager.svelte";
    import './themes/default.css'
    import '../../index.css'
    import type {FlutiWebSiteData} from "$lib/fluti/flutiSvelteTypes";
    import {onMount} from "svelte";


    interface Fluti {
        websiteData?: FlutiWebSiteData
        useThemes?: boolean,
        useWindows?: boolean,
        useAlerts?: boolean,
        useBreakpoints?: boolean,
        useUserSession?: boolean,
    }

    let {
        useThemes = true,
        useWindows = true,
        useBreakpoints = true,
        useAlerts = true,
        useUserSession = true,
        websiteData = {
            domain: 'localhost',
            tweeter: {
                title: 'template title',
                description: 'template description'
            }
        }
    }: Fluti = $props();

    function appendScriptTag() {
        const tagNoScript = `
<noscript>
    <iframe
        title="google-tag"
        src="https://www.googletagmanager.com/ns.html?id=${websiteData?.google?.tagId}"
        height="0"
        width="0"
        style="display:none;visibility:hidden">
    </iframe>
</noscript>`;

        document.body.insertAdjacentHTML("beforeend", tagNoScript);
    }


    onMount(() => {
        if (websiteData?.google?.tagId)
            appendScriptTag();
    })
</script>

<svelte:head>
    <script async src="https://js.stripe.com/v3/"></script>
    <title>{websiteData?.title}</title>
    <meta name="description" content={websiteData?.description}>

    <meta property="og:title" content={websiteData?.title}>
    <meta property="og:description" content={websiteData?.description}>
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="1200">
    <meta property="og:site_name" content={websiteData.domain} data-next-head="">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="pl_PL"/>
    <meta property="og:url" content={websiteData.domain}>
    <meta property="og:image" content="{websiteData.domain}/social.png">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content={websiteData?.tweeter?.title ?? websiteData?.title}>
    <meta name="twitter:description" content={websiteData?.tweeter?.description ?? websiteData?.description}>
    <meta name="twitter:image:type" content="image/png">
    <meta name="twitter:image:width" content="1200">
    <meta name="twitter:image:height" content="630">
    <meta name="twitter:image" content="{websiteData.domain}/social.png">

    <link rel="canonical" href={websiteData.domain}>

    <meta property="al:web:url" content={websiteData.domain}>
    <meta property="al:web:should_fallback" content="true">

    {#if websiteData?.google?.tagId}
        <script>
            (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start':
                        new Date().getTime(), event: 'gtm.js'
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', websiteData?.google?.tagId);
        </script>
    {/if}
</svelte:head>

{#if useAlerts}
    <AlertManager/>
{/if}


{#if useUserSession}
    <UserManager/>
{/if}

{#if useThemes}
    <ThemeManager/>
{/if}

{#if useWindows}
    <WindowManager/>
{/if}

{#if useBreakpoints}
    <BreakpointManager/>
{/if}