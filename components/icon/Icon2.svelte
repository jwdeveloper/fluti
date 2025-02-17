<script lang="ts">
    import Grid from "$lib/fluti/components/panel/Grid.svelte";
    import type {Icon2Props} from "$lib/fluti/components/icon/iconProps";

    let {
        icon,
        border = 'var(--border-size) solid var(--text-muted)',
        radius = 'var(--radius-strong)',
        padding = 'var(--padding)',
        ripplerEffect = true,

        ...props
    }: Icon2Props = $props()
</script>


<Grid
        tag="button"
        border={border}
        padding={padding}
        radius={radius}
        ripplerEffect={ripplerEffect}
        style="font-size: var(--font-size-huge)"
        {...props}>
    <slot/>
    <i class={icon}/>
</Grid>