<script lang="ts">
    import type {SwitchProps} from "./Switch";
    import {onMount} from "svelte";
    import {addRippleEffect} from "../../effects/RippleEffect";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Element from "$lib/fluti/components/panel/Element.svelte";

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

    const makeAnimation = (time=200) => {
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
                duration: time,
                easing: 'ease-out',
                fill: 'forwards'
            }
        );
    }

    onMount(() => {
        makeAnimation(0)
    })

</script>


<div id={id}
         class="switch-container"
         use:addRippleEffect={flutiTheme.background.tertiary}
         onclick= {handleClick}>
    <div bind:this={element} class="ball"></div>
</div>


<style>
    :global(.switch-container) {
        background: var(--bg-primary);
        border: var(--border-size-medium) solid var(--bg-tertiary);
        color: var(--color-darker);
        padding: var(--border-size-medium);
        font-size: var(--font-size-big);
        user-select: none;
        border-radius: var(--radius-medium);
        width: 2.5em;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.2s ease-in-out;
    }

    .ball {
        height: var(--font-size-medium);
        position: relative;
        width: var(--font-size-medium);
        border-radius: 50%;
            background: var(--text-muted);
        z-index: var(--z-index-4);
    }

    :global(.switch-active) {
        background: var(--text-light) !important;
        background: var(--accent-primary) !important;
        border-color: var(--text-light) !important;
    }

</style>