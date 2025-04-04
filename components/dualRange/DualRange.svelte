<script lang="ts">
    import {tick} from "svelte";

    import type {DualRangeProps} from "./DualRange";

    let {
        min = 0,
        max = 100,
        step = 1,
        minValue = $bindable(0),
        maxValue = $bindable(50)
    }: DualRangeProps = $props();

    let minRangeValueGap = 1;
    let rangeElement: HTMLHtmlElement;
    let rangeMinElement: HTMLHtmlElement;
    let rangeMaxElement: HTMLHtmlElement;

    const minRangeFill = () => {
        const percentageLeft = ((minValue - min) / (max - min)) * 100;
        rangeElement.style.left = percentageLeft + "%";
    };

    const maxRangeFill = () => {
        let percentageRight = 100 - ((maxValue - min) / (max - min)) * 100;
        // percentageRight = 50
        rangeElement.style.right = percentageRight + "%";
    };


    const onRangeClick = async (e: MouseEvent) => {
        const element = e.currentTarget as HTMLElement;

        const x = e.offsetX;
        const width = element.offsetWidth;
        const clickedPoint = x / width; // Normalized value between 0 and 1

        const middle = (maxValue + minValue) / 2; // Actual middle value
        const normalizedMiddle = (middle - minValue) / (maxValue - minValue); // Middle point normalized
        const minX = minValue / max; // Normalized min value
        const maxX = maxValue / max; // Normalized max value

        let isMin = clickedPoint <= minX; // Check if click is closer to min
        if (clickedPoint > minX && clickedPoint < maxX) {
            const distanceToMin = Math.abs(clickedPoint - minX);
            const distanceToMax = Math.abs(clickedPoint - maxX);

            // Determine whether to update min or max based on proximity
            isMin = distanceToMin < distanceToMax;
        }

        if (isMin) {
            let value = Math.max(min, Math.min(maxValue - 1, clickedPoint * (max - min) + min));
            minValue = parseInt(value)
        } else {
            let value = Math.min(max, Math.max(minValue + 1, clickedPoint * (max - min) + min));
            maxValue = parseInt(value)
        }

        await tick();

        // Update the range UI
        minRangeFill(); // Update min range UI
        maxRangeFill(); // Update max range UI    }
    }

    const onInputUpdated = (e: any) => {
        minRangeFill();
        maxRangeFill();

        if (maxValue - minValue < minRangeValueGap) {

            if (e.target.className === "min") {
                rangeMinElement.value = maxValue - minRangeValueGap;
                minRangeFill();
                e.target.style.zIndex = "2"
            } else {
                rangeMaxElement.value = minValue + minRangeValueGap;
                e.target.style.zIndex = "2"
                maxRangeFill();
            }
        }

    }

    $effect(() => {
        minValue
        maxValue
        minRangeFill();
        maxRangeFill();

    })

</script>

<div class="double_range_slider_box" onmousedown={onRangeClick}>

    <div class="double_range_slider">
        <div class="range_track" bind:this={rangeElement}></div>
        <input type="range" oninput={onInputUpdated}
               bind:this={rangeMinElement}
               class="range-input min"
               min={min} max={max} bind:value={minValue}
               step={step}/>

        <input type="range" oninput={onInputUpdated}
               bind:this={rangeMaxElement}
               class="range-input max"
               min={min} max={max} bind:value={maxValue}
               step={step}/>
    </div>
</div>


<style>
    .double_range_slider_box {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 1em;
        padding: 1.1em 0;

        cursor: pointer;
    }

    .double_range_slider {
        width: 100%;
        height: 10px;
        position: relative;
        background-color: var(--bg-100);
        border-radius: 1em;
        border: 2px solid var(--bg-200);
    }

    .range_track {
        height: 100%;
        pointer-events: none;
        position: absolute;
        border-radius: 20px;
        background-color: var(--bg-200);
    }

    input {
        position: absolute;
        width: 100%;
        height: 5px;

        background: none;
        pointer-events: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        top: 50%;
        transform: translateY(-50%);
    }

    input::-webkit-slider-thumb {

          height: 1.2em;
        width: 1.2em;
        border-radius: 50%;
        /*border: 3px solid var(--bg-accent-darker);*/
        background-color: var(--bg-accent);
        pointer-events: auto;
        -webkit-appearance: none;
        cursor: e-resize;
        margin-bottom: 1px;

    }

    input::-moz-range-thumb {
        height: 1.2em;
        width: 1.2em;
        border-radius: 50%;
        border: 3px solid var(--bg-accent-darker);
        background-color: var(--bg-accent);
        pointer-events: auto;
        -webkit-appearance: none;
        cursor: pointer;
        margin-top: 30%;
    }

</style>