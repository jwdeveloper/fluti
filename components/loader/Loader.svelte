<script lang="ts">

    import {blur} from "svelte/transition";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties.ts";

    let {
        isLoading = $bindable(true),
        background = 'transparent',
        showSpinner = true,
        children = undefined,
        radius = flutiTheme.radius.huge
    } = $props();
</script>

{#if isLoading}

    <div class="loader" out:blur style="border-radius: {radius}; background: {background}; ">
        {#if children}
            {@render children()}
        {:else}
            {#if showSpinner}
                <i class=" fa fa-spinner fa-spin"></i>
            {/if}
        {/if}
    </div>


{/if}

<style>

    .loader {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        font-size: var(--font-size-big);
        display: flex;
        overflow: hidden;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(10px);
        border-radius: var(--radius-huge);
        z-index: var(--z-index-2);

        i {
            font-size: 3em;
            color: var(--accent-primary);
        }
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
