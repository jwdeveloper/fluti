<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

    interface SkeletonProps extends ElementProps {
        isLoading?: boolean
        timeout?: number
        extraFakeLoadingTime?: number
        reversed?: boolean
        showChildren?: boolean
    }

    const {
        isLoading = $bindable(false),
        showChildren = false,
        reversed = false,
        timeout = 100,
        extraFakeLoadingTime = 0,
        children,
        ...props
    }: SkeletonProps = $props();


    let showLoading = $state(isLoading)
    $effect(() => {
        isLoading
        if (isLoading === true) {
            setTimeout(() => {
                showLoading = isLoading;
            }, timeout)
        }
        if (isLoading === false) {
            if (extraFakeLoadingTime > 0) {
                setTimeout(() => {
                    showLoading = false;
                }, extraFakeLoadingTime)
                return
            }

            showLoading = false;

        }
    })
    //
    // let lastCondition = $state(false)
    // $effect(() => {
    //     isLoading
    //     setTimeout(() => {
    //         lastCondition = isLoading
    //     }, timeout)
    // })
</script>


{#if !showLoading}
    {#if children}
        {@render children()}
    {/if}
{:else }
    <Element className="skeleton-element {reversed?'skeleton-element-reversed':''}"
             {...props}>
        {#if showChildren && children}
            {@render children()}
        {/if}
    </Element>
{/if}

<style>
    :global(.skeleton-element) {
        display: inline-block;
        height: 1em;
        border-radius: var(--radius-medium);
        background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite linear;
    }

    :global(.skeleton-element-reversed) {
        animation: skeleton-loading-reversed 1.5s infinite linear;
    }


    @keyframes skeleton-loading {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    @keyframes skeleton-loading-reversed {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }
</style>