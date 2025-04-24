<script lang="ts">
    import type {HeaderSectionProps} from "$lib/fluti/sections/header/types";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";
    import HeaderDesktop from "$lib/fluti/sections/header/HeaderDesktop.svelte";
    import HeaderMobile from "$lib/fluti/sections/header/HeaderMobile.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let props: HeaderSectionProps = $props();
</script>

<Element height="auto" width="100%" direction="column">

    {#if breakpoints.isMobile}
        <HeaderMobile {...props}/>
    {:else}
        <HeaderDesktop {...props}/>
    {/if}
<!--    <Space variant="large"/>-->
<!--    <Space variant="large"/>-->
</Element>
