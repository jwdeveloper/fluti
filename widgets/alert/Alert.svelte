<script lang="ts">

    import {blur} from "svelte/transition";
    import {useWindow} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte.js";
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";

    let {message, type, id, destroy} = $props()

    let popup = useWindow(MessageSnippet)

    let handleDestroy = () => {
        destroy()
    }

    let handleClick = () => {
        popup.open();
    }

    let handleCopy = () => {

        navigator.clipboard.writeText(message).then(() => {
            console.log('copied text')
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

</script>


{#snippet MessageSnippet()}
    <Panel columns="auto 1fr" style="pointer-events: none">
        <Icon icon="fa fa-copy" onClick={handleCopy}/>
        <div onclick={handleCopy} style="user-select: text;">
            {message}
        </div>
    </Panel>
{/snippet}

<div transition:blur class="alert alert-{type}" onclick={handleClick}>
    <div class="content">
        <div>
            {message}
        </div>
        <div style="display: flex; justify-content: flex-end;">
            <i class="fa fa-close" onclick={handleDestroy}></i>
        </div>
    </div>

</div>


<style>

    .content {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1em;
        cursor: pointer;
    }

    .alert {

        i {
            cursor: pointer;
        }

        pointer-events: all;
        padding: 1em 1.5em;
        border-radius: var(--radius);
        font-weight: bold;
        background: var(--bg-accent);
        box-shadow: 0 0 1em 1em var(--shadow);
        color: var(--bg-100);
        width: 15%;
        height: auto;
    }
</style>