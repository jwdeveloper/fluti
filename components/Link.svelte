<script lang="ts">

    let {
        url = undefined,
        style = '',
        onClick = () => {
        }
    } = $props();


    const handleClick = (e) => {

        if (!onClick)
            return

        if (navigator)
            navigator.vibrate(25);

        onClick(e)
    }

</script>

<a class="offer-url" onclick={handleClick} href={url} target="_blank"
   style="margin:1em 0 1.5em 0; font-size: var(--font-size-small);{style}; "
   rel="noopener noreferrer">
    <slot/>
</a>


<style>

    .offer-url {
        color: var(--text-primary);
        font-weight: bold;
        cursor: pointer;

        @media (max-width: 600px) {
            font-size: var(--font-size-desktop);
        }

    }

    .offer-url:hover {
        color: var(--text-light);
    }

</style>