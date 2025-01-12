<script>

    import {blur} from "svelte/transition";
    let {isLoading = $bindable(true), background='transparent'} = $props();
</script>

{#if isLoading}
    <div class="loader" transition:blur  style="background: {background}">
        <i class=" fa fa-spinner fa-spin"></i>
    </div>
{/if}

<style>

    .loader {
        position: absolute;
        left: 0;
        top:0;
        height: 100%;
        width: 100%;
        font-size: var(--font-size-big);
        display: flex;
        overflow: hidden;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(10px);
        z-index: 3;

        i {
            font-size: 3em;
            color: var(--text-light);
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
