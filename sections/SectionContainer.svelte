<script lang="ts">
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let props: ElementProps = $props();
</script>

<Element
        mobile={{height:'auto',padding:'1em'}}
        style="min-height: 100vh;
 height: 100%;
 width: 100%"
        direction="column"
        tag="section"
        justify="space-between"
        align="flex-start"
        overflow="hidden"
        padding="5% 5%"
        {...props}>
    <slot/>
</Element>