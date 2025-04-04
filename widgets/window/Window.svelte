<script lang="ts">
    import {blur, scale} from 'svelte/transition';
    import {WindowCloseReason} from "./WindowManagerImpl.svelte.js";

    let {
        isOpen = $bindable(false),
        closeWindow = () => {
        },
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


<div id="window-wrapper"

     transition:blur
     bind:this={element}
     class="wrapper"
     onclick={hide}>
    <div transition:scale >
        <slot/>
    </div>
</div>

<style>

    .window {
        height: 100%;
        width: 100%;

        border-radius: var(--radius-medium);
        background: var(--bg-100);
        position: relative;
        z-index: var(--z-index-5);

        display: grid;
        background: green;
    }


    .wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        height: 100%;
        width: 100%;
        z-index: var(--z-index-5);
        left: 0;
        backdrop-filter: blur(5px) brightness(0.5);
        /*backdrop-filter: brightness(0.45);*/
        padding: 0;
    }
</style>
