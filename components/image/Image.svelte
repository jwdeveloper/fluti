<script lang="ts">
    import {onMount} from "svelte";
    import Loader from "$lib/fluti/components/loader/Loader.svelte";
    import Skieleton from "$lib/fluti/components/skieleton/Skieleton.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";


    let {src, alt='', className = '', rootStyle=''} = $props()

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
                    observer.disconnect();
                    isVisible = true;
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

<div bind:this={element}
     style="height: 100%; width: 100%; {rootStyle};">
    <Skieleton
            radius={flutiTheme.radius.medium}
            height="100%"
            width="100%"
            timeout={0}
            isLoading={()=>isLoading === true}>
        <figure class="img-container {className}">
            {#if isVisible}
                <img alt={alt} src={src} onload={handleImageLoad}/>
            {/if}
        </figure>
    </Skieleton>
</div>
<slot/>

<style>
    .img-container {
        height: 100%;
        padding-top: 100%;
    }

    .img-container img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--radius-medium);
    }
</style>
