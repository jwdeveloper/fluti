<script lang="ts">
    import {useWindowManager, WindowCloseReason} from "./WindowManagerImpl.svelte.js";
    import Window from "./Window.svelte";

    const manager = useWindowManager();
    const windows = $derived.by(() => manager.handlers)

    const focusedWindow = $derived.by(() => {
        for (let i = windows.length - 1; i >= 0; i--) {
            if (windows[i].isOpen) {
                return windows[i];
            }
        }
        return undefined;
    })

    function snippetOrComponent(obj) {
        if (typeof obj !== 'function') {
            return "unknown";
        }

        if (obj.prototype) {
            return "component"
        }
        return 'snippet';
    }

    let openWindows = $derived.by(() => {
        return windows.filter(e => e.isOpen)
    })

</script>


{#each openWindows as window (window.id)}
    <Window isOpen={window.isOpen}
            window={window}
            focusedWindow={focusedWindow}
            closeWindow={(e: WindowCloseReason)=>window.close(e)}>
        {#if snippetOrComponent(window.component) === 'snippet'}
            {@render window.component(window, {...window.input})}
        {:else}
            <svelte:component this={window.component}
                              {...window.input}
                              window={window}/>
        {/if}
    </Window>
{/each}