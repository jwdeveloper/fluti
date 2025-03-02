<script lang="ts">

    import CounterDigit from "./CounterDigit.svelte";

    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";


    interface CounterProps {
        value: string | number
        letterTheme?: ElementProps
        fontSize?: number
        fontColor?: string
        fontWeight?: number
        offset?: number
        maxOffset?: number
        letterOffset?: number
    }

    //
    // const {
    //     value = $bindable("0"),
    //     fontSize = 60,
    //     offset = 0.8,
    //     maxOffset = 16,
    //     letterTheme
    // }: CounterProps = $props();

    const {
        value = $bindable("0"),
        fontSize = 35,
        offset = -1,
        letterOffset = -1,
        maxOffset = 16,
        fontColor = flutiTheme.color.primary,
        fontWeight = 400,
        letterTheme
    }: CounterProps = $props();


    let letters: string[] = $state([])
    let distances: number[] = [];
    let totalWidth = $state(0)

    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    let isLetter = (current: string) => {
        return digits.includes(current) === false;
    }

    $effect(() => {
        value
        if (value === '' || value === undefined) {
            letters = []
            return
        }
        let valueToSplit = value;
        valueToSplit = value + ''

        let tempLetters = valueToSplit.split("") as string[];
        let currentDistance = 0;
        let index = 0;
        let offsetValue = offset === -1 ? fontSize * 0.009 : offset;
        let tempDistances = []

        let letterOffsetValue = Math.min(maxOffset, fontSize) + (fontSize / 2) * offsetValue;
        if (letterOffset !== -1)
            letterOffsetValue = letterOffset;

        for (let letter of tempLetters) {
            let dis = 0
            if (isLetter(letter))
                dis += letterOffsetValue
            else
                dis += Math.min(maxOffset, fontSize) + (fontSize / 2) * offsetValue;


            if (index < tempLetters.length - 1) {
                if (isLetter(tempLetters[index]) && !isLetter(tempLetters[index + 1])) {
                    currentDistance -= offsetValue * fontSize / 10;
                }
            }

            currentDistance += dis;
            tempDistances.push(currentDistance)
            index++;
        }
        distances = [0, ...tempDistances]
        totalWidth = currentDistance;
        letters = tempLetters;

    })

</script>

<Element
        className="counter-container"
        width="{totalWidth}px"
        height="{fontSize}px"
        justify="flex-start">
    {#each letters as digit, index}
        <CounterDigit current={digit}
                      fontSize={fontSize}
                      fontWeight={fontWeight}
                      fontColor={fontColor}
                      distance={distances[index]}
                      index={index}/>
    {/each}
</Element>


<style>
    :global(.counter-container) {
        position: relative;
    }
</style>