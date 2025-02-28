<script lang="ts">

    import CounterDigit from "./CounterDigit.svelte";
    import {onMount} from "svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let {input = $bindable("0")} = $props();
    let digits = $state([])

    $effect(() => {
        input
        console.log('input is', input)
        if (input === '' || input === undefined) {
            digits = []
            return
        }
        let spi = input + '';
        digits = spi.split("").map(Number);

    })

    onMount(() => {
        input
        if (input === '' || input === undefined) {
            digits = []
            return
        }
        let spi = input + '';
        digits = spi.split("").map(Number);
    })
</script>

<Element width="100%"  justify="flex-start">
    {#each digits as digit, index}
        <CounterDigit current={digit}/>
    {/each}
</Element>

