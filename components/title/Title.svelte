<script lang="ts">
    interface TitleProps {
        variant?: 'normal' | 'title-small' | 'title-huge';
        color?: 'normal' | "dark"
        style?: string;
    }

    let {variant = 'normal', color = 'normal',style=''}: TitleProps = $props();

</script>

<h1 class="{variant}" style="color: {color === 'normal'? 'var(--text-primary)':'var(--text-light)' } {style}">
    <slot/>
</h1>


<style>

    :global(.title-small) {
        font-size: 1.5em !important;
    }


    :global(.title-huge) {
        font-size: 5em !important;
    }
    h1 {
        font-size: 2em;
        font-weight: bold;
        color: var(--bg-tertiary);
    }
</style>