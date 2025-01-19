<script lang="ts">
    interface TitleProps {
        color?: 'light' | 'primary' | 'secondary' | 'muted' | 'neutral' | 'error',
        weight?: 'normal' | 'bold' | '400' | '500' | '600' | '900'
        style?: string;
        className?: string;
        tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        lineHeight?: "1" | "2" | "3" | "4" | 'normal'
        children?: any
    }

    let {
        className = '',
        color = 'primary',
        weight = 'bold',
        tag = 'h1',
        lineHeight = "normal",
        style = '',
        children = undefined,
    }: TitleProps = $props();

</script>

<svelte:element this={tag}
                class="{className}"
                style="
                 line-height:{lineHeight};
                 font-weight:{weight};
                 color: var(--text-{color});
{style}">
    {#if children}
        {@render children()}
    {/if}
</svelte:element>


<style>
    a {
        line-height: normal;
    }
</style>