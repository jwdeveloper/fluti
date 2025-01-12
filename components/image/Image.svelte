<script lang="ts">
    import Loader from "$lib/fluti/components/loader/Loader.svelte";
    import {onMount} from "svelte";


    let {src, className = ''} = $props()

    let isLoading = true;
    let isVisible = false;
    let observer: IntersectionObserver;
    let element: HTMLHtmlElement

    function handleImageLoad() {
        isLoading = false;
    }

    onMount(() => {
        observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    isVisible = true;
                    observer.disconnect();
                }
            },
            {
                root: null,
                threshold: 0.1
            }
        );

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (observer) observer.disconnect();
        };
    });
</script>

<div class="img-container {className}" bind:this={element}>
    {#if isLoading}
        <div class="loader" style="display: {isLoading ? 'block' : 'none'}">
            <Loader isLoading={isLoading}/>
        </div>
    {/if}
    <img src={src} class={className}  onload={handleImageLoad}/>
</div>

<style>
    .loader {
        position: absolute;
        height: 100%;
        width: 100%;
        left: 0;
        top: 0;
    }

    .img-container {
        position: relative;
        width: 100%; /* Full width of its container */
        padding-top: 100%;
    }

    .img-container img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover; /* Ensures the image fills the container proportionally */
        border-radius: 1em;
    }
</style>
