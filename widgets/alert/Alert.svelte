<script lang="ts">

    import {blur} from "svelte/transition";

    import {useWindow} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte.js";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Title from "$lib/fluti/components/title/Title.svelte";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

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

    let getIcon = $derived.by(()=>
    {
        if(type === 'success')
            return "fa-solid fa-exclamation"

        return "fa fa-warning"
    })
</script>


{#snippet MessageSnippet()}
    <Panel columns="auto 1fr"
           background={flutiTheme.color.error}

           style="pointer-events: none; border: 1px solid var(--accent-primary)">
        <Icon icon="fa fa-copy" onClick={handleCopy}/>
        <div onclick={handleCopy} style="user-select: text;">
            {message}
        </div>
    </Panel>
{/snippet}

<div transition:blur onclick={handleClick}>
    <Element className="alert ">

        <Panel display="grid"
               background='red'
               className="alert-{type}"
               color="white"
               style="border: 1px solid red"
               padding="0.5em 1em" columns="1fr auto 1fr">

            <i class={getIcon}></i>
            <h4>
                {message}
            </h4>
            <div style="display: flex; justify-content: flex-end;">
                <i class="fa fa-close" onclick={handleDestroy}></i>
            </div>
        </Panel>
    </Element>
</div>


<style>

    :global(.alert-success)
    {
        background-color: green !important;
        border-color: green !important;
    }

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