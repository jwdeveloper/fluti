<script lang="ts">
    import type {InputProps} from "./Input.type";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import InputPanel from "$lib/fluti/components/panel/InputPanel.svelte";

    let {
        placeholder,
        value = $bindable(''),
        error = $bindable(false),
        readonly = false,
        required = false,
        type = 'text',
        id,
        className,
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
        }
    }: InputProps = $props();

    let finalId: any = '';
    if (id !== undefined) {
        finalId = id;
    } else {
        finalId = type == 'text' ? Math.random() : type;
    }

    function handleFocus(event: FocusEvent) {

        if (type === 'email')
            return

        const input = event.target as HTMLInputElement;
        // Remove text selection and move the cursor to the end
        input.setSelectionRange(input.value.length, input.value.length);
    }

    let element;
    let handleMouseDown = () => {
        // element.classList.add('placeholder-down')
    }

    let handleMouseUp = () => {
        // element.classList.remove('placeholder-down')
    }

    let borderColor = $derived.by(() => {
        if (error === true)
            return 'var(--text-error)'
        return 'var(--text-primary)'
    })

</script>


<InputPanel
        style="border: 1px solid {borderColor};"
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
            style="{style}; z-index: 3"
    />
    <slot/>
</InputPanel>


<style>
    /* Your existing styles */

    :global(.placeholder-down) {
        top: -1em !important;
        background: var(--bg-200) !important;
        border-radius: 0.3em !important;
        padding: 1em !important;
        border-bottom-left-radius: 0em !important;
        border-bottom-right-radius: 0em !important;
        /*scale: 0.9 !important;*/
        color: var(--bg-accent) !important;
        font-weight: 600 !important;
    }

    :global(.input-border) {
        border: 1px solid var(--bg-accent);
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
    }

    :global(.input-pointer) {
        cursor: pointer;
        user-select: none !important;
    }


    input:focus {
        /*outline: none;*/
        /*border: 1px solid var(--text-light);*/
    }

    input::placeholder {
        color: var(--text-primary);

    }

    input {
        padding: 0.7em 1em;
        border-radius: var(--radious-1);
        user-select: none;
        width: 100%;
        transition: all 200ms ease-in-out;
        font-size: var(--font-size-normaler);
        color: var(--text-light);
        background: transparent;
    }

    input:hover {
        /*box-shadow: inset 0px 0px 0.1em 0.05em var(--bg-accent-darker);*/
        /*background: var(--bg-000);*/
    }
</style>
