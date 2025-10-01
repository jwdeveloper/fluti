<script lang="ts">


    import type {InputProps2} from "$lib/fluti/components/input/Input.type";

    interface TextboxProps extends InputProps2 {
        maxCharacters?: number;
        selectedText?: string;
    }

    let {
        value = $bindable(''),
        selectedText = $bindable(''),
        placeholder = "...start typing",
        focus = false,
        maxCharacters = -1,
        style = ''
    }: TextboxProps = $props();

    let element: HTMLHtmlElement;

    $effect(() => {
        if (focus && element)
            element.focus()
    })

    function handleSelection() {
        const start = element.selectionStart;
        const end = element.selectionEnd;
        selectedText = value.slice(start, end);
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key.toLowerCase() === 'escape') {
            // Blur the element first
            element.blur();

            // Re-dispatch a new KeyboardEvent globally (to window or document)
            const newEvent = new KeyboardEvent('keydown', {
                key: 'Escape',
                code: 'Escape',
                bubbles: true,
                cancelable: true,
            });
            window.dispatchEvent(newEvent);
        }
    }

    $effect(() => {
        if (maxCharacters <= 0) {
            return
        }

        if (value.length > maxCharacters) {
            maxCharacters = maxCharacters.splice(0, maxCharacters);
        }
    })
</script>

<textarea
        bind:this={element}
        bind:value={ value}
        onkeydown={handleKeyPress} onselect={handleSelection} placeholder={placeholder} style={style}>
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