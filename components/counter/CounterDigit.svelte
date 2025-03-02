<script lang="ts">

    import {Spring} from "svelte/motion";

    let {
        current, index,
        fontSize,
        fontWeight,
        fontColor,
        distance
    } = $props();

    const count = new Spring(0);
    const offset = $derived(modulo(count.current, 1));
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    let isLetter = $derived.by(() => {
        return digits.includes(current) === false;
    })


    $effect(() => {
        current
        if (!isLetter)
            count.target = parseFloat(current);
    })

    function modulo(n, m) {
        return ((n % m) + m) % m;
    }

    function isDigit(value: string): boolean {
        return /^\d+$/.test(value);
    }
</script>


<div class="counter-viewport" style="
width: {fontSize}px;
height: {fontSize}px;
left:{distance}px;">
    <div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
        <strong class="hidden"
                style="
                color: {fontColor};
                font-weight: {fontWeight};
                font-size: {fontSize}px"
                aria-hidden="true">
            {#if isLetter}
                {current}
            {:else}
                {Math.floor(count.current + 1)}
            {/if}
        </strong>
        <strong style="
                color: {fontColor};
                font-weight: {fontWeight};
                font-size: {fontSize}px">
            {#if isLetter}
                {current}
            {:else}
                {Math.floor(count.current)}
            {/if}
        </strong>
    </div>
</div>


<style>

    .counter-viewport {
        overflow: hidden;
        text-align: center;
        background: transparent;
        position: relative;
        position: absolute;
    }

    .counter-viewport strong {
        position: absolute;

        display: flex;
        width: 100%;
        height: 100%;
        font-weight: 800;
        color: var(--text-light);
        align-items: center;
        justify-content: center;
        background: transparent;
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