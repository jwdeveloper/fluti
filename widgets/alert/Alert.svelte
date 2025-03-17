<script lang="ts">

    import {blur} from "svelte/transition";

    import {useWindow} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte.js";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Title from "$lib/fluti/components/title/Title.svelte";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

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
    <Panel columns="auto 1fr" style="pointer-events: none; border: 1px solid var(--accent-primary)">
        <Icon icon="fa fa-copy" onClick={handleCopy}/>
        <div onclick={handleCopy} style="user-select: text;">
            {message}
        </div>
    </Panel>
{/snippet}

<div transition:blur onclick={handleClick}>

    <Element className="alert alert-{type}">

        <Panel display="grid"
               style="border: 1px solid var(--accent-primary)"
               padding="1em" columns="1fr auto">

            <Title tag="h4">
                {message}
            </Title>
            <div style="display: flex; justify-content: flex-end;">
                <i class="fa fa-close" onclick={handleDestroy}></i>
            </div>
        </Panel>
    </Element>


</div>


<style>


    .alert {

        i {
            cursor: pointer;
        }

        pointer-events: all;
        padding: 1em 1.5em;
        border-radius: var(--radius);
        font-weight: bold;
        background: var(--bg-primary);
        /*box-shadow: 0 0 1em 1em var(--shadow);*/
        color: var(--bg-100);
        height: auto;
    }
</style>