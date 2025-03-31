<script lang="ts">
    import InputPanel from "$lib/fluti/components/panel/InputPanel.svelte";
    import Link from "../Link.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let {
        value = $bindable(false),
        onClick = (event: MouseEvent) => {
        },
        onUpdate = (input: boolean) => {
        },
        children = undefined,
        style = '',
        required = false
    } = $props();

    let isFocues = $state(false)
    let isInvalid = $derived.by(() => {
        if (required === false)
            return false

        return value === false
    })

    $effect(() => {
        value
        if (onClick)
            onClick(value);
    })

    let chandleUpdate = (e: any) => {
        e.stopPropagation();
        e.preventDefault();

        onUpdate(e.target.checked)
    }


    function handleClick(event: any) {
        value = !value;

    }
</script>


{#snippet InputSnippet()}

    <InputPanel
            onClick={handleClick}
            style="{isFocues?'border: 2px solid var(--text-light); !important':''}"
            className="element-checkbox {isInvalid ? 'invalid' : ''}">

        <input type="checkbox"
               required={true}
               onfocus={()=> isFocues= true}
               onfocusout={()=> isFocues= false}
               bind:checked={value} tabindex="0"/>

        <span class="checkmark">
        <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="check-icon"
        >
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    </span>
    </InputPanel>
{/snippet}


{#if children}
    <Element
            display="grid"
            columns="auto 1fr" padding="0" gap="0.5em">
        <InputSnippet/>
        <Link onClick={handleClick}>
            {@render children()}
        </Link>
    </Element>
{:else }
    <InputSnippet/>
{/if}

<style>

    :global(.label-checked) {
        border-color: var(--bg-accent) !important;
    }

    :global(.element-checkbox:hover) {
        border-color: var(--text-light);
    }

    :global(.element-checkbox) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 1.6em;
        height: 1.6em;
        background: var(--bg-primary) !important;
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        border-radius: 6px;

        border: var(--border-size) solid var(--text-muted)
    }

    input[type="checkbox"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;

    }


    .checkmark {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2em;
        height: 2em;
        transition: background-color 0.3s ease;
        color: transparent;
        pointer-events: none;
    }

    :global(.invalid) {
        border-color: var(--text-error);
        background: color-mix(in srgb, var(--text-error) 10%, var(--bg-primary) 20%) !important;

    }

    /* Optional: Red color on hover if invalid */
    :global(.invalid:hover) {
        border-color: darkred !important;
    }

    .checkmark svg {
        width: 15px;
        height: 15px;
    }

    input[type="checkbox"]:checked + .checkmark {
        /*background-color: var(--text-light);*/
        color: var(--text-light);

    }

    input[type="checkbox"]:checked + .checkmark svg {
        display: inline-flex;
    }
</style>
