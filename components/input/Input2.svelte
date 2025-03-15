<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {InputProps2} from "./Input.type";
    import {onMount} from "svelte";
    import './input2.css'
    import Hint from "$lib/fluti/components/hint/Hint.svelte";

    let {
        value = $bindable(),
        variant = 'outline',
        invalid,

        onIconClick = () => {
        },
        ...props
    }: InputProps2 = $props()
    let element: HTMLHtmlElement;

    let updatedFromEffect = false;
    $effect(() => {
        if (!element)
            return

        if (!shouldSetValue())
            return;

        updatedFromEffect = true
        //@ts-ignore
        element.value = value ?? ''
        updatedFromEffect = false
    })

    onMount(() => {
        const updateValue = (event: Event) => {
            if (updatedFromEffect)
                return
            value = (event.target as HTMLInputElement).value ?? '';
        };

        element.addEventListener("input", updateValue);
        return () => {
            element.removeEventListener("input", updateValue);
        };
    });

    const shouldSetValue = () => {
        if (props.type === 'file')
            return false
        return true
    }

</script>


<div class="root">
    <input
            bind:this={element}
            class="element-input element-input-{variant} {invalid? 'element-input-invalid':''}"
            value={value}
            type={props.type}
            placeholder={props.placeholder}
            disabled={props.disabled}
            name={props?.id}
            pattern={props.regex}
            required={props.required}
            onclick={props.onClick}
            {...props}
    />

    {#if props?.icon}
        <div class="icon" onclick={onIconClick}>
            <i class={props?.icon}></i>
        </div>
    {/if}

    {#if props?.textIcon}
        <div class="text-icon">
            {props.textIcon}
        </div>
    {/if}
</div>


<style>

    .root {
        position: relative;
        height: auto;
        display: flex;
        align-items: center;
        width: 100%;


        .icon {
            position: absolute;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            color: var(--text-muted);
            padding-right: 1em;
            pointer-events: none;

            i{
                pointer-events: all;
                height: 1em;
                text-align: center;
                width: 1em;
            }
        }

        .text-icon {
            position: absolute;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 1em;
            color: var(--text-muted);
            pointer-events: none;
        }
    }


    :global(.element-input) {
        width: 100%;
        padding: var(--padding-medium) 1em;
        padding-right: 2.5em;
        border-radius: var(--radius-medium);
        border: var(--border-size-medium) solid var(--bg-tertiary);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: var(--font-size-medium);
        transition: 100ms all ease-in;

    }

    :global(.element-input:not(:placeholder-shown)) {
        color: var(--text-light) !important;
    }

    :global(.element-input:focus) {
        border-bottom-color: var(--text-muted);
        border-bottom-right-radius: var(--radius-small);
        border-bottom-left-radius: var(--radius-small);
        outline: none;
    }

    :global(.element-input:disabled) {
        background: var(--bg-secondary);
        cursor: not-allowed;
        opacity: var(--opacity-medium);
    }

    :global(.element-input-invalid), :global(.element-input:invalid) {
        border-color: var(--text-error);
        background: color-mix(in srgb, var(--text-error) 10%, var(--bg-primary) 20%);
        border-radius: var(--radius-medium);
    }

    :global(.element-input:-webkit-autofill) {
        box-shadow: 0 0 0 1000px var(--bg-primary) inset !important;
        background: var(--bg-primary);
    }


    :global(.element-input[type="number"])::-webkit-inner-spin-button,
    :global(.element-input[type="number"])::-webkit-outer-spin-button {
        -webkit-appearance: none;
    }

    :global(.element-input[type="number"]) {
        -moz-appearance: textfield;

    }

</style>

