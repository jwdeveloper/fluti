<script lang="ts">
    import type {HeaderSectionProps} from "$lib/fluti/sections/header/types";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";
    import HeaderDesktop from "$lib/fluti/sections/header/HeaderDesktop.svelte";
    import HeaderMobile from "$lib/fluti/sections/header/HeaderMobile.svelte";

    let props: HeaderSectionProps = $props();
</script>

{#if breakpoints.isMobile}
    <HeaderMobile {...props}/>
{:else}
    <HeaderDesktop {...props}/>
{/if}