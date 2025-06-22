<script lang="ts">
    import ThemeManager from "$lib/fluti/widgets/theme/ThemeManager.svelte";
    import AlertManager from "$lib/fluti/widgets/alert/AlertManager.svelte";
    import WindowManager from "$lib/fluti/widgets/window/WindowManager.svelte";
    import BreakpointManager from "$lib/fluti/widgets/breakpoints/BreakpointManager.svelte";
    import UserManager from "$lib/fluti/widgets/user/UserManager.svelte";
    import './themes/default.css'
    import '../../app.css'
    import type {FlutiWebSiteData} from "$lib/fluti/flutiSvelteTypes";
    import {onMount} from "svelte";
    import {
        googleAnalitycsHeadContent,
        googleTagBodyContent,
        googleTagHeadContent
    } from "$lib/fluti/widgets/google/googleTagHeadContent";


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
            country: "PL-pl",
            tweeter: {
                image: 'social.png',
                title: 'template title',
                description: 'template description'
            }
        }
    }: Fluti = $props();


    onMount(() => {
        if (websiteData?.google?.tagId) {
            let bodyTag = googleTagBodyContent(websiteData?.google?.tagId);
            document.head.insertAdjacentHTML("beforeend", bodyTag);

            let headTag = googleTagHeadContent(websiteData?.google?.tagId);
            document.head.insertAdjacentHTML("beforeend", headTag);
        }

        if (websiteData?.google?.analyticsId) {
            let headTag = googleAnalitycsHeadContent(websiteData?.google?.analyticsId);
            document.head.insertAdjacentHTML("beforeend", headTag);
        }

        if (websiteData?.stripe) {
            let stripeHtml = "<script async src={websiteData.stripe?.url ?? 'https://js.stripe.com/v3/'}/>"
            document.head.insertAdjacentHTML('beforeend', stripeHtml);
        }
    })
</script>

<svelte:head>
    <title>{websiteData?.title}</title>
    <meta name="description" content={websiteData?.description}>
    <meta name="keywords" content={websiteData?.keywords}>
    <meta property="og:title" content={websiteData?.title}>
    <meta property="og:description" content={websiteData?.description}>
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="1200">
    <meta property="og:site_name" content={websiteData.domain} data-next-head="">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content={websiteData.country}/>
    <meta property="og:url" content={websiteData.domain}>
    <meta property="og:image" content="{websiteData.domain}/{websiteData.tweeter?.image ?? 'logo.png'}">
    <meta property="og:type" content="{websiteData.pageType ?? 'website'}"/>

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content={websiteData?.tweeter?.title ?? websiteData?.title}>
    <meta name="twitter:description" content={websiteData?.tweeter?.description ?? websiteData?.description}>
    <meta name="twitter:image:type" content="image/png">
    <meta name="twitter:image:width" content="1200">
    <meta name="twitter:image:height" content="630">
    <meta name="twitter:image" content="{websiteData.domain}/{websiteData.tweeter?.image ?? 'logo.png'}">

    <meta property="al:web:url" content={websiteData.domain}>
    <meta property="al:web:should_fallback" content="true">

    <link rel="canonical" href={websiteData?.url ?? websiteData?.domain}>
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