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
        --space-tiny: 0.05rem;
        --space-small: 0.8rem;
        --space-medium: 1.5rem;
        --space-large: 2rem;
        --space-huge: 3rem;
    }

</style>