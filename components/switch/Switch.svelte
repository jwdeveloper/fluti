<script lang="ts">
    import type {SwitchProps} from "./Switch";
    import {addRippleEffect} from "../../effects/RippleEffect";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

    let {
        value = $bindable(false),
        id = '',
        readonly = false,
        onUpdate = () => {
        }
    }: SwitchProps = $props();
    let element: HTMLDivElement;

    const handleClick = () => {
        if (readonly)
            return

        value = !value;
        makeAnimation();
        onUpdate(value, id)
    }

    const makeAnimation = (time = 200) => {
        let left = value ? '0' : "100%";
        let leftEnd = value ? '100%' : "0%"

        let transform = value ? 'translate(0, 0)' : "translate(-100%, 0)"
        let transformEnd = value ? 'translate(-100%, 0)' : "translate(0, 0)"

        // if (value)
        //     element.classList.add("switch-active")
        // else
        //     element.classList.remove("switch-active")


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

    $effect(() => {
        value
        makeAnimation()
    })

</script>


<div id={id}
     class="switch-container {value?'switch-active':''}"
     style="opacity: {readonly?0.5:1}"
     use:addRippleEffect={flutiTheme.background.tertiary}
     onclick={handleClick}>
    <div bind:this={element} class="ball"/>
</div>


<style>
    :global(.switch-container) {
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
        background: var(--bg-tertiary);

    }


    .ball {
        height: var(--font-size-medium);
        position: relative;
        width: var(--font-size-medium);
        border-radius: 50%;
        z-index: var(--z-index-2);
        background: var(--bg-primary);
    }

    :global(.switch-active) {
        /*background: var(--text-light) !important;*/
        /*background: var(--accent-primary) !important;*/
        /*border-color: var(--text-light) !important;*/
        background: var(--accent-primary);
    }

</style>