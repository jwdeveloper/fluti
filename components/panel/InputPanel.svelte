<script lang="ts">

    import type {PanelProps} from "./Panel.type";
    import Panel from "./Panel.svelte";

    let {children = undefined, ...data}: PanelProps = $props();


    // ripplerEffectColor="var(--text-neutral)"
    //    ripplerEffect={true}

</script>


<Panel
       radius="var(--radius-medium)"
       background="var(--bg-tertiary)"
       padding="0"
       {...data}
     >

    {@render children()}
</Panel>