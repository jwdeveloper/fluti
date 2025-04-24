<script lang="ts">
    import Space from "$lib/fluti/components/space/Space.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import type {TitleAndTextElementProps} from "$lib/fluti/sections/common/types";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let {
        textWidth = "100%",
        spaceSize = 'tiny',
        ...props
    }: TitleAndTextElementProps = $props();
</script>

<h3 style="text-transform: uppercase; font-weight: normal; color: {props.color}">{props.subTitle}</h3>
<h2>{props.title}</h2>

{#if props?.text}
    <Space variant={spaceSize}/>
    <Element width={textWidth}>
        <h3 style="font-weight: normal; color: {flutiTheme.color.muted}">
            {props.text}
        </h3>
    </Element>
{/if}


<style>

    h3 {
        font-weight: 500;
    }

    h2 {
        font-weight: bold;
        font-size: 3.2rem;
    }

</style>