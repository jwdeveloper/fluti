<script lang="ts">

    import type {PanelProps} from "./Panel.type";
    import Panel from "./Panel.svelte";

    let {children = undefined, ...data}: PanelProps = $props();
</script>


<Panel
       ripplerEffectColor="var(--text-neutral)"
       ripplerEffect={true}
       radius="0.6em"
       background="var(--bg-tertiary)"
       padding="0"
       {...data}

     >

    {@render children()}
</Panel>