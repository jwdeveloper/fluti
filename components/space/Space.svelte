<script lang="ts">

    import type {Variant} from "$lib/fluti/themes/themeTypes";

    interface SpaceProps {
        variant?: Variant
    }

    const {variant = 'medium'}: SpaceProps = $props();
    const variantName = `var(--space-${variant})`

</script>

<div class="space-element" style="margin-top: {variantName}"/>

<style>


    .space-element {
        --space-tiny: 0.5em;
        --space-small: 0.8em;
        --space-medium: 1.5em;
        --space-large: 2em;
        --space-huge: 3em;
    }

</style>