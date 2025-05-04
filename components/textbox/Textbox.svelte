<script lang="ts">


    import type {InputProps2} from "$lib/fluti/components/input/Input.type";

    let {
        value = $bindable(''),
        placeholder = "...start typing",
        focus = false,
        maxCharacters = -1,
        style = ''
    }: InputProps2 = $props();

    let element: HTMLHtmlElement;

    $effect(() => {
        if (focus && element)
            element.focus()
    })

    $effect(() => {
        if (maxCharacters <= 0) {
            return
        }

        if (value.length > maxCharacters) {
            maxCharacters = maxCharacters.splice(0, maxCharacters);
        }
    })
</script>

<textarea bind:this={element} bind:value={ value} placeholder={placeholder} style={style}>
</textarea>


<style>
    textarea::placeholder {
        /*color: var(--text-muted); !* Change to your desired color *!*/
    }

    textarea:focus {
        outline: none;
    }

    textarea {
        font-size: var(--font-size-medium);
        border-radius: var(--radius-medium);
        padding: 1em;
        border: var(--border-size-medium) solid var(--bg-tertiary);
        scrollbar-width: thin;
        height: 100%;
        width: 100%;
        user-select: none;
        background: var(--bg-primary);
        color: var(--text-light);
        transition: all 200ms ease-in-out;
    }
</style>