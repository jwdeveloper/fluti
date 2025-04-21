<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
    import type {CompanyContactBarProps} from "$lib/fluti/sections/header/types";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

    let {padding, ...props}: CompanyContactBarProps = $props();
</script>

<Element
        background={flutiTheme.background.accent}
        justify="flex-end"
        padding="0 {padding}"
        width="100%">

    <Element
            justify="flex-end"
            background={flutiTheme.background.accent}
            padding="0.8em 0"
            mobile={{  justify:'flex-start'}}
            {...props}>

        <Element
                mobile={{
                align:'flex-start',
                gap:"0.5em",
                direction:'column'}}
                gap="2em">
            {@render InfoIcon(props?.phone)}
            {@render InfoIcon(props?.email)}
            {@render InfoIcon(props?.address)}
        </Element>
    </Element>
</Element>


{#snippet InfoIcon(data)}
    {#if data}
        <Element>
            <i style="color:white" class={data.icon}/>
            <p style="font-weight: 100 !important;color:white">{data.value}</p>
        </Element>
    {/if}
{/snippet}