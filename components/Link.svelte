<script lang="ts">
    import {vibrate} from "$lib/fluti/utils/Wait";

    let {
        url = undefined,
        style = '',
        openInNewWindow = true,
        onClick = () => {
        }
    } = $props();


    const handleClick = (e) => {

        if (!onClick)
            return

        vibrate();
        onClick(e)
    }

</script>

<a class="offer-url" onclick={handleClick} href={url} target={openInNewWindow?"_blank":''}
   style="{style}; "
   rel="noopener noreferrer">
    <slot/>
</a>


<style>

    .offer-url {
        /*margin: 1em 0 1.5em 0;*/
        font-size: var(--font-size-small);
        color: var(--text-primary);
        font-weight: bold;
        cursor: pointer;
        border-bottom: var(--border-size-medium) solid transparent;
    }

    .offer-url:hover {
        color: var(--text-light);
        border-bottom: var(--border-size-medium) solid var(--text-muted);
    }

</style>