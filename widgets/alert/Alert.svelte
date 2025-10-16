<script lang="ts">
    import {blur, fade} from "svelte/transition";
    import {useWindow} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte.js";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
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

    let getIcon = $derived.by(() => {
        if (type === 'success')
            return "fa-solid fa-check-circle"
        else if (type === 'info')
            return "fa-solid fa-info-circle"
        else if (type === 'warning')
            return "fa-solid fa-exclamation-triangle"
        else
            return "fa-solid fa-times-circle"
    })

    let getTitle = $derived.by(() => {
        if (type === 'success')
            return "Success"
        else if (type === 'info')
            return "Info"
        else if (type === 'warning')
            return "Warning"
        else
            return "Error"
    })
</script>

{#snippet MessageSnippet()}
    <Panel
            padding="16px"
            style="pointer-events: auto; border-radius: 6px; border: 1px solid var(--fluti-border-accent); background-color: var(--fluti-bg-dark); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);"
    >
        <div class="message-popup">
            <div class="message-header">
                <span class="message-title">{getTitle}</span>
                <Icon
                        icon="fa fa-copy"
                        onClick={handleCopy}
                        style="cursor: pointer; color: var(--fluti-text-muted); font-size: 14px; transition: color 0.2s ease;"
                        hoverStyle="color: var(--fluti-text);"
                />
            </div>

            <div
                    class="message-content"
                    onclick={handleCopy}
                    style="user-select: text;"
            >
                {message}
            </div>
        </div>

    </Panel>
{/snippet}

<div transition:fade={{duration: 200}} >
    <Element className="alert">
        <div class="alert-wrapper alert-{type}">
            <div class="alert-icon">
                <i class={getIcon}></i>
            </div>
            <div class="alert-content" onclick={handleClick}>
                <span class="alert-title">{getTitle}</span>
                <span class="alert-message">{message}</span>
            </div>
            <div class="alert-close" onclick={handleDestroy}>
                <i class="fa fa-times" ></i>
            </div>
        </div>
    </Element>
</div>

<style>
    /* Fluti theme variables */
    :root {
        --fluti-bg: #1e1e1e;
        --fluti-bg-dark: #191919;
        --fluti-bg-light: #2a2a2a;
        --fluti-border: #333333;
        --fluti-border-accent: #444444;
        --fluti-text: #dcddde;
        --fluti-text-muted: #999999;
        --fluti-accent: #7b6cd9;
        --fluti-success: #58a464;
        --fluti-warning: #d79a61;
        --fluti-error: #e06c75;
        --fluti-info: #7b6cd9;
    }

    :global(.alert) {
        width: 100%;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .alert-wrapper {
        display: flex;
        align-items: flex-start;
        padding: 14px 16px;
        border-radius: 6px;
        background-color: var(--fluti-bg);
        border: 1px solid var(--fluti-border);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        cursor: pointer;
        transition: all 0.2s ease;
        pointer-events: all;
        min-width: 300px;
    }

    .alert-wrapper:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateY(-1px);
    }

    .alert-icon {
        flex-shrink: 0;
        font-size: 18px;
        padding-right: 14px;
        display: flex;
        align-items: center;
    }

    .alert-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .alert-title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 4px;
    }

    .alert-message {
        font-size: 13px;
        line-height: 1.4;
        color: var(--fluti-text-muted);
        word-break: break-word;
    }

    .alert-close {
        font-size: 14px;
        color: var(--fluti-text-muted);
        cursor: pointer;
        padding: 4px;
        margin: -4px;
        display: flex;
        align-items: center;
        transition: color 0.2s ease;
    }

    .alert-close:hover {
        color: var(--fluti-text);
    }

    .alert-success {
        border-left: 4px solid var(--fluti-success);
    }

    .alert-success .alert-icon {
        color: var(--fluti-success);
    }

    .alert-success .alert-title {
        color: var(--fluti-success);
    }

    .alert-error {
        border-left: 4px solid var(--fluti-error);
    }

    .alert-error .alert-icon {
        color: var(--fluti-error);
    }

    .alert-error .alert-title {
        color: var(--fluti-error);
    }

    .alert-warning {
        border-left: 4px solid var(--fluti-warning);
    }

    .alert-warning .alert-icon {
        color: var(--fluti-warning);
    }

    .alert-warning .alert-title {
        color: var(--fluti-warning);
    }

    .alert-info {
        border-left: 4px solid var(--fluti-info);
    }

    .alert-info .alert-icon {
        color: var(--fluti-info);
    }

    .alert-info .alert-title {
        color: var(--fluti-info);
    }

    /* Message popup styling */
    .message-popup {
        color: var(--fluti-text);
    }

    .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .message-title {
        font-weight: 600;
        font-size: 14px;
    }

    .message-content {
        font-size: 14px;
        line-height: 1.5;
        color: var(--fluti-text-muted);
        padding: 10px;
        background-color: var(--fluti-bg);
        border-radius: 4px;
        border: 1px solid var(--fluti-border);
    }
</style>