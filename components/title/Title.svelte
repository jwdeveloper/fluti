<script lang="ts">
    interface TitleProps {
        variant?: 'normal' | 'title-small' | 'title-huge';
        color?: 'normal' | "dark"
        style?: string;
    }

    let {variant = 'normal', color = 'normal', style = ''}: TitleProps = $props();

</script>

<h1 class="{variant}"
    style="color: {color === 'normal'? 'var(--text-light)':'var(--text-primary)' } {style}">
    <slot/>
</h1>


<style>

    :global(.title-small) {
        font-size: 1.5em !important;
    }


    :global(.title-huge) {
        font-size: 5em !important;

        @media (max-width: 600px) {
            font-size: 2.5em !important;
        }

    }

    h1 {
        font-size: 2em;
        font-weight: 800;
        color: var(--bg-tertiary);
    }
</style>