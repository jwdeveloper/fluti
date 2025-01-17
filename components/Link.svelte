<script lang="ts">

    let {
        url = undefined,
        style = '',
        onClick = () => {
        }
    } = $props();

</script>

<a class="offer-url" onclick={()=> onClick()} href={url} target="_blank"
   style="{style}"
   rel="noopener noreferrer">
    <slot/>
</a>


<style>

    .offer-url {
        color: var(--text-primary);
        font-weight: bold;
        cursor: pointer;

        @media (max-width: 600px) {
            font-size: var(--font-size-mobile);
        }

    }

    .offer-url:hover {
        color: var(--text-light);
    }

</style>