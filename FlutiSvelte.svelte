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
        path?: string
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
        path = '/',
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

    let page = websiteData?.pages?.find(e => e.url === path);
    let data = {
        title: page?.title ?? websiteData?.title ?? 'page',
        description: page?.description ?? websiteData?.description ?? '',
        keywords: page?.keywords ?? websiteData?.keywords ?? ''
    }

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
    <title>{data.title}</title>
    <meta content={data.description} name="description">
    <meta content={data.keywords} name="keywords">
    <meta content={data.title} property="og:title">
    <meta content={data.description} property="og:description">
    <meta content="image/png" property="og:image:type">
    <meta content="1200" property="og:image:width">
    <meta content={websiteData.domain} data-next-head="" property="og:site_name">
    <meta content="630" property="og:image:height">
    <meta content={websiteData.country} property="og:locale"/>
    <meta content={websiteData.domain} property="og:url">
    <meta content="{websiteData.domain}/{websiteData.tweeter?.image ?? 'logo.png'}" property="og:image">
    <meta content="{websiteData.pageType ?? 'website'}" property="og:type"/>

    <meta content="summary_large_image" name="twitter:card">
    <meta content={websiteData?.tweeter?.title ?? websiteData?.title} name="twitter:title">
    <meta content={websiteData?.tweeter?.description ?? websiteData?.description} name="twitter:description">
    <meta content="image/png" name="twitter:image:type">
    <meta content="1200" name="twitter:image:width">
    <meta content="630" name="twitter:image:height">
    <meta content="{websiteData.domain}/{websiteData.tweeter?.image ?? 'logo.png'}" name="twitter:image">

    <meta content={websiteData.domain} property="al:web:url">
    <meta content="true" property="al:web:should_fallback">

    <link href={websiteData?.url ?? websiteData?.domain} rel="canonical">
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