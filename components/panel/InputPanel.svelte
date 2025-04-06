<script lang="ts">

    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

    let {children = undefined, ...data}: ElementProps = $props();


    // ripplerEffectColor="var(--text-neutral)"
    //    ripplerEffect={true}

</script>


<Element
       radius="var(--radius-medium)"
       background="var(--bg-tertiary)"
       padding="0"
       {...data}
     >

    {@render children()}
</Element>