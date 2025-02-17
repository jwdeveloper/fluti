<script lang="ts">

    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";

    let {title, ...props} = $props();
</script>


<Space variant="large"/>
<h3>{title}</h3>
<Element
        mobile="{{direction:'column'}}"
        direction="row"
        {...props}>
    <slot/>
</Element>


