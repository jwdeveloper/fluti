<script lang="ts">
    import {
        blur,
        slide
    } from 'svelte/transition';
    import {WindowCloseReason} from "./WindowManagerImpl.svelte.js";

    let {
        isOpen = $bindable(false),
        closeWindow = () => {},
        focusedWindow,
        window,
    } = $props();

    let element: HTMLHtmlElement


    $effect(() => {
        if (isOpen) {
            document.body.style.overflow = 'none'
        } else {
            document.body.style.overflow = 'auto'
        }

        if (isOpen && element) {
            element.focus()
        }
    })

    const hide = (event: MouseEvent) => {
        // @ts-ignore
        if (event.target.id !== 'window-wrapper')
            return

        closeWindow(WindowCloseReason.offscreen);
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key !== "Escape")
            return;

        if (focusedWindow.id === window.id) {
            closeWindow(WindowCloseReason.escape);
        }
    }

</script>
<svelte:window onkeydown={handleKeyPress}></svelte:window>
{#if isOpen}
    <div id="window-wrapper"
         transition:blur
         bind:this={element}
         class="wrapper"
         onclick={hide}>
        <div transition:slide class="window">
            <slot/>
        </div>
    </div>
{/if}

<style>

    .window {
        height: auto;
        width: auto;
        padding: 2em;
        border: 2px solid var(--color-ligher);
        border-radius: 0.5em;
        background: var(--bg-100);
        box-shadow: 0 0 1em 0.5em var(--shadow);
        position: relative;
        z-index: 200000;
    }


    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        height: 100%;
        width: 100%;
        z-index: 999999;
        left: 0;
        backdrop-filter: blur(5px) brightness(0.5);
        backdrop-filter:  brightness(0.45);
    }
</style>
