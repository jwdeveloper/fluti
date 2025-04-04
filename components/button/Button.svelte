<script lang="ts">

    import type {ButtonProps} from "./Button";
    import './Button.css';
    import JumpingDots from "$lib/fluti/components/loader/JumpingDots.svelte";
    import {addRippleEffect} from "../../effects/RippleEffect";

    let {
        onClick = () => {
        },
        size = 'btn-normal',
        variant = 'btn-normal',
        fullWidth = false,
        className = '',
        icon = '',
        style = '',
        type = 'button',
        disabled = false,
        isLoading = $bindable(false),
        onMouseOver,
        //@ts-ignore
        children
    }: ButtonProps = $props();

    let element: HTMLHtmlElement

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter" || event.code === "Enter") {
            if (type !== 'submit') {
                event.preventDefault();
            } else {
                element.click()
            }

            if (onClick)
                onClick();
        }
    }

    function handleMouseOver(status: boolean, e: MouseEvent) {
        if (!onMouseOver)
            return
        onMouseOver(status, e);
    }

    function handleClick(event: MouseEvent) {
        event.stopPropagation();
        onClick(event);
    }
</script>


<button
        bind:this={element}
        use:addRippleEffect
        onclick={handleClick}
        onkeydown={handleKeyDown}
        onmouseenter={(e)=> handleMouseOver(true,e)}
        onmouseleave={(e) => handleMouseOver(false, e)}
        type={type}
        class="
        {size}
        {variant}
        {fullWidth ? 'full-width' : ''}
        {className}
    "
        disabled={isLoading || disabled}
        style={style}>

    {#if icon}
        <div class="icon-container">
            <i class="{icon}"></i>
        </div>
    {/if}
    {#if isLoading}
        <JumpingDots/>
    {/if}

    {#if children}
        <div class="content" style="justify-content: {icon?'flex-start':'center'}">
            {@render children?.()}
        </div>
    {/if}


</button>


<style>

    .icon-container {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .content {
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        text-wrap: nowrap;
        text-align: left;
    }

    .spinner-container {
        position: absolute;
        display: flex;
        justify-content: flex-start;
        pointer-events: none;
        padding: 0 5%;
        width: 100%;
    }

    button[disabled] {
        /*cursor: wait;*/
        cursor: default;
    }

    button {
        padding: 1em;
        border: none;
        cursor: pointer;
        color: var(--bg-accent);
        gap: 0.5em;
        position: relative;
        font-weight: 600;
        border-radius: 0.3em;
        height: 2.3em;
        font-size: 1.3em;
        transition: all 100ms ease-in-out;
        position: relative; /* Required for ripple positioning */
        overflow: hidden; /* Prevent the ripple from overflowing */
        align-items: center;
        justify-content: space-between !important;

        @media (max-width: 768px) {
            min-width: 3em;
            height: 3em !important;
            font-size: var(--font-size-huge);
        }

    }

    button:focus {
        outline: 2px solid var(--bg-accent-darker); /* Custom focus outline */
    }

    button:focus, button:hover {
        background: var(--bg-200);
        color: var(--bg-accent);
    }
</style>
