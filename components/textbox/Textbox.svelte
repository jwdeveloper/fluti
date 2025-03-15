<script lang="ts">


    import type {InputProps} from "$lib/fluti/components/input/Input.type";

    let {value = $bindable(''), placeholder = "...start typing", style = ''}: InputProps = $props();
</script>

<textarea bind:value={ value} placeholder={placeholder} style={style}>
</textarea>


<style>
    textarea::placeholder {
        color: var(--text-muted); /* Change to your desired color */
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