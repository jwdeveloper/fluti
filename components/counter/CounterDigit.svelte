<script lang="ts">

    import {Spring} from "svelte/motion";

    let {current} = $props();

    $effect(() => {
        count.target = parseFloat(current);
    })

    const count = new Spring(0);
    const offset = $derived(modulo(count.current, 1));

    function modulo(n, m) {
        return ((n % m) + m) % m;
    }

    function isDigit(value: string): boolean {
        return /^\d+$/.test(value);
    }

</script>


{#if isDigit(current)}
    <div class="counter-viewport">
        <div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
            <strong class="hidden" aria-hidden="true">{Math.floor(count.current + 1)}</strong>
            <strong>{Math.floor(count.current)}</strong>
        </div>
    </div>
{:else}
    <div class="counter-viewport">
        <h1>{current}</h1>
    </div>
{/if}


<style>

    .counter-viewport {
        height: 2em;
        width: 1.1em;
        overflow: hidden;
        text-align: center;
        position: relative;
        background: transparent;
    }

    .counter-viewport strong {
        position: absolute;

        display: flex;
        width: 100%;
        height: 100%;
        font-weight: 400;
        color: var(--text-light);
        background: transparent;
        font-size: 2rem;
        align-items: center;
        justify-content: center;
    }

    .counter-digits {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .hidden {
        top: -100%;
        user-select: none;
    }
</style>