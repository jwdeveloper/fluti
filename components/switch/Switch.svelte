<script lang="ts">
    import type {SwitchProps} from "./Switch";
    import {onMount} from "svelte";
    import {addRippleEffect} from "../../effects/RippleEffect";

    let {
        value = $bindable(true), id = '', onUpdate = () => {
        }
    }: SwitchProps = $props();
    let element: HTMLDivElement;

    const handleClick = () => {
        value = !value;
        makeAnimation();
        onUpdate(value, id)
    }

    const makeAnimation = () => {
        let left = value ? '0' : "100%";
        let leftEnd = value ? '100%' : "0%"

        let transform = value ? 'translate(0, 0)' : "translate(-100%, 0)"
        let transformEnd = value ? 'translate(-100%, 0)' : "translate(0, 0)"

        if (value)
            element.classList.add("switch-active")
        else
            element.classList.remove("switch-active")


        element.animate(
            [
                {
                    left: left,
                    transform: transform,
                },
                {
                    left: leftEnd,
                    transform: transformEnd,

                }
            ],
            {
                duration: 200,
                easing: 'ease-out',
                fill: 'forwards'
            }
        );
    }

    onMount(() => {
        makeAnimation()
    })

</script>


<div id={id} class="container"
     use:addRippleEffect={{color:"red"}}
     style="background: {value?'var(--bg-tertiary)':'var(--bg-secondary)'}"
     onclick={handleClick}>
    <div bind:this={element} class="ball"></div>
</div>


<style>
    .container {
        padding: 0.3em;
        border: 2px solid var(--text-primary);
        color: var(--color-darker);
        font-size: var(--font-size-big);
        user-select: none;
        border-radius: 16px;
        width: 3.2em;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        transition: all 0.2s ease-in-out;
    }
    .container:hover
    {
        background: var(--text-light);
        /*border-color: var(--text-muted);*/

    }

    .ball {
        height: 1.2em;
        position: relative;
        width: 1.2em;
        z-index: 10 !important;
        border-radius: 50%;
        background: var(--text-neutral);
    }

    :global(.switch-active) {
        background: var(--text-light) !important;
        border-color: var(--text-light) !important;

    }

    .ball:hover {
        /*background: var(--text-primary);*/
    }
</style>