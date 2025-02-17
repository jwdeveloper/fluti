<script lang="ts">
    import {onMount} from "svelte";
    import Loader from "$lib/fluti/components/loader/Loader.svelte";


    let {src, className = ''} = $props()

    let isLoading = $state(true);
    let isVisible = $state(false);
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
                    isLoading = false;
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

<figure class="img-container {className}" bind:this={element}>
    <Loader bind:isLoading={isLoading}/>
    <img src={src} onload={handleImageLoad}/>
    <slot/>
</figure>

<style>
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
