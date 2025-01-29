<script lang="ts">
    import type {InputProps} from "./Input.type";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import InputPanel from "$lib/fluti/components/panel/InputPanel.svelte";
    import {onMount} from "svelte";

    let {
        placeholder,
        value = $bindable(''),
        error = $bindable(false),
        readonly = false,
        required = false,
        type = 'text',
        id,
        className,
        focused = $bindable(false),
        disabled = false,
        iconSymbol = '',
        variant = '',
        icon = '',
        style,
        onKeydown = () => {
        },
        onKeyup = () => {
        },
        onValueChanged = () => {
        },
        onClick = () => {
        },
        children = undefined
    }: InputProps = $props();

    let finalId: any = '';
    if (id !== undefined) {
        finalId = id;
    } else {
        finalId = type == 'text' ? Math.random() : type;
    }

    let isFocused = $state(false)

    function handleFocus(event: FocusEvent) {


        if (type === 'email')
            return
        if (type === 'color')
            return;

        const input = event.target as HTMLInputElement;
        // Remove text selection and move the cursor to the end
        input.setSelectionRange(input.value.length, input.value.length);
        isFocused = true;
    }

    let element;
    let handleMouseDown = () => {
        // element.classList.add('placeholder-down')
        isFocused = false;
    }

    let handleMouseUp = () => {
        // element.classList.remove('placeholder-down')
        isFocused = false;

    }

    let borderColor = $derived.by(() => {

        if (isFocused)
            return 'var(--text-light)'

        if (error === true)
            return 'var(--text-error)'
        return 'var(--text-muted)'
    })

    onMount(() => {

        if (focused) {
            let element = document.getElementById(finalId)
            if (!element)
                return
            element.focus()
        }
    })

</script>


<InputPanel
        style="
        border: var(--border-size) solid {borderColor};
        border:none;
         position: relative"
        width="100%"
        className={className}
>

    {#if icon !== ''}
        <div class="input-icon">
            <i class={icon}></i>
        </div>
    {/if}

    <div class="input-icon">{iconSymbol}</div>
    <input
            bind:value={value}
            id={finalId}
            readonly={readonly}
            required={required}
            onclick={onClick}
            disabled={disabled}
            onkeydown={onKeydown}
            onkeyup={onKeyup}
            onmousedown={handleMouseDown}
            onfocusout={handleMouseUp}
            onfocus={handleFocus}
            oninput={onValueChanged}
            type={type}
            autocomplete="email"
            class="{readonly ? 'input-pointer' : ''} {className} {variant}"
            placeholder={placeholder}
            style="{style}; z-index: 2;border: var(--border-size) solid {borderColor}; "
    />

    {#if children}
        {@render children()}
    {/if}
</InputPanel>


<style>
    /* Your existing styles */

    :global(.input-border) {
        border: var(--border-size) solid var(--bg-accent);
    }

    input[disabled] {
        background-color: var(--bg-primary);
        color: var(--text-muted);
    }

    input:-webkit-autofill {
        /*background-color: white !important;*/
        transition: background-color 5000s ease-in-out 0s;
    }


    input[disabled]:hover {
        box-shadow: none;
    }

    .input-icon {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 1em;
        height: 100%;
        width: 100%;
        color: var(--color-darker);
        z-index: 2;
        pointer-events: none;

        i {
            color: var(--text-primary);
        }

        @media (max-width: 768px) {
            font-size: var(--font-size-huge);

        }
    }

    :global(.input-pointer) {
        cursor: pointer;
        user-select: none !important;
    }


    input:focus {
        outline: none;
    }

    input::placeholder {
        color: var(--text-primary);
    }

    input {
        padding: 0.6em 1em;
        border-radius: var(--radius-medium);
        user-select: none;
        width: 100%;
        transition: all 200ms ease-in-out;
        font-size: var(--font-size-normaler);
        color: var(--text-light);
        background: var(--bg-secondary);


        @media (max-width: 768px) {
            font-size: var(--font-size-big);
        }

    }

    input:hover {
        /*box-shadow: inset 0px 0px 0.1em 0.05em var(--bg-accent-darker);*/
        /*background: var(--bg-000);*/
    }
</style>
