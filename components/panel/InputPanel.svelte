<script lang="ts">

    import type {PanelProps} from "./Panel.type";
    import Panel from "./Panel.svelte";

    let {children = undefined, ...data}: PanelProps = $props();
</script>


<Panel ripplerEffect={true}
       {...data}
       ripplerEffectColor="var(--text-neutral)"
       radius="0.6em"
       background="var(--bg-tertiary)"
       padding="0"
     >

    {@render children()}
</Panel>