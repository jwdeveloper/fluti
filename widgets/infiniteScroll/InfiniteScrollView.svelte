<script lang="ts">
    import type {InfiniteScrollProps} from "./InfiniteScrollProps.ts";
    import {useInfiniteScrollController} from "./InfiniteScrollController.svelte";
    import Loader from "$lib/fluti/components/loader/Loader.svelte";
    import Textbox from "$lib/fluti/components/textbox/Textbox.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {useServerRenderConfig} from "$lib/fluti/components/panel/ServerRenderConfig";

    let {
        controller = useInfiniteScrollController(),
        itemTemplate = undefined,
        loadingTemplate = defaultLoader,
        errorTemplate = defaultErrorTemplate,
        noResultsTemplate = defaultNoResultTemplate,
        threshold = 100,
        container
    }: InfiniteScrollProps = $props();

    let ticking = false;

    //onScroll
    //Instead of triggering handleScroll on every scroll event (which can be frequent and cause unnecessary function calls), debounce it to reduce the number of times it’s executed.
    const onScroll = () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            if (controller.isLoading) {
                ticking = false;
                return;
            }

            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const remainingScroll = document.documentElement.scrollHeight - (scrollTop + window.innerHeight);
            if (remainingScroll < threshold) {
                controller.requestNextBatch();
            }

            ticking = false;
        });
    };


</script>

<svelte:window onresize={onScroll} onscroll={onScroll}/>

{#if controller.error}
    {@render errorTemplate(controller.error)}
{:else}
    <Element direction="column"
             height="auto"
             width="100%"
             {...container}>
        {#if controller.items.length === 0 &&
        controller.isLoading === false &&
        useServerRenderConfig.serverSide === false
        }
            {@render noResultsTemplate()}
        {:else}
            {#each controller.items as item, index (item.id)}
                {#if itemTemplate}
                    {@render itemTemplate(item, index)}
                {/if}
            {/each}
        {/if}
        {#if controller.isLoading}
            {@render loadingTemplate()}
        {/if}
    </Element>
{/if}


{#snippet defaultNoResultTemplate()}
    <Element width="100%" height="100vh" style="position: fixed; z-index: 3; bottom: 0">
        No result
    </Element>
{/snippet}

{#snippet defaultLoader()}
    <Element width="100%" height="100vh" style="position: fixed; z-index: 3; bottom: 0">
        <Loader bind:isLoading={controller.isLoading}/>
    </Element>
{/snippet}

{#snippet defaultErrorTemplate(error)}
    <Element height="200px" width="100%">
        <Textbox value={error}></Textbox>
    </Element>
{/snippet}