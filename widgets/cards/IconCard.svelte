<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import type {Variant} from "$lib/fluti/themes/themeTypes";

    interface IconCardProps extends ElementProps {
        icon?: string
        title?: string
        subtitle?: string
        space?: Variant
    }

    let {
        icon = '',
        space,
        title = '', subtitle = '', ...props
    }: IconCardProps = $props();


</script>


<Element
        width="100%" gap="1em"
        align="flex-start"
        justify="flex-start"
        {...props}>

    <Element padding="0.2em 0 0 0">
        <Button2 variant="outline"
                 radius="50%"
                 icon={icon} size="large"/>
    </Element>
    <Element direction="column"
             justify="flex-start"
             align="flex-start"
             gap="0"
             width="100%">
        <h3 style="line-height: 1.7em;">
            {title}
        </h3>
        {#if space}
            <Space variant={space}/>
        {/if}
        <h4 style:color={flutiTheme.color.muted} style:font-weight="normal">
            {subtitle}
        </h4>
    </Element>
</Element>
