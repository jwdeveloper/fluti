<script lang="ts">
    import {fly} from "svelte/transition";
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import {onMount} from "svelte";
    import type {AnimatePropertyOptions} from "$lib/fluti/effects/animations/AnimatorExtensions";
    import type {PanelProps} from "$lib/fluti/components/panel/Panel.type";
    import {easeFunction} from "$lib/fluti/utils/ease";
    import {flyWithNoOpacity} from "$lib/fluti/effects/fly";
    import Grid from "$lib/fluti/components/panel/Grid.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    interface WindowLayer {
        visible?: boolean
        size?: string,
        height?: string,
        panel?: PanelProps,
        background?: {
            blur?: string
            brightness?: string
            color?: string
        },
        animation?: {
            direction?: "left" | "top" | "bottom" | "right",
            duration?: number
        },
        children?: any
    }

    let {
        children = undefined,
        size = "60%",
        height = "100%",
        visible = $bindable(false),
        panel = {},
        ...options
    }: WindowLayer = $props();
    let rootElement: HTMLDivElement;
    let rootAnimatedElement: any;
    let isClient = $state(false);
    let init = false

    let defaultValues = {
        blur: "3px",
        brightness: "70%",
        direction: "right",
        duration: 400
    }

    $effect(() => {
        visible
        if (!isClient)
            return;

        if (!init) {
            init = true;
            if (!visible)
                return;
        }

        if (!rootElement)
            return
        if (!rootAnimatedElement)
            rootAnimatedElement = animatedElement(rootElement);

        if (options?.background?.blur) {
            makeBlurAnimation();
        } else {
            makeBrightnessAnimation();
        }

        if (options?.background?.color) {
            makeBackgroundColorAnimation();
        }
    })


    function makeBackgroundColorAnimation() {
        let color = options?.background?.color;
        let animateOptions: AnimatePropertyOptions = {
            property: 'background',
            from: visible ? "transparent" : color,
            to: visible ? color : "transparent",
            time: getDuration() * 1.75,
            easing: 'ease-in-out'
        }
        rootAnimatedElement.animateProperty(animateOptions)
    }

    function makeBrightnessAnimation() {
        let minBrightness = options?.background?.brightness ?? "70%"
        let animateOptions: AnimatePropertyOptions = {
            property: 'backdropFilter',
            from: `brightness(${visible ? "100%" : minBrightness})`,
            to: `brightness(${visible ? minBrightness : "100%"})`,
            time: getDuration(),
            easing: 'ease-in-out'
        }
        rootAnimatedElement.animateProperty(animateOptions)

    }

    function makeBlurAnimation() {
        let minBrightness = options?.background?.brightness ?? defaultValues.brightness
        let targetValue = options?.background?.blur ?? defaultValues.blur

        let animateOptions: AnimatePropertyOptions = {
            property: 'backdropFilter',
            from: `blur(${visible ? "0" : targetValue}) brightness(${visible ? "1" : minBrightness})`,
            to: `blur(${visible ? targetValue : "0"}) brightness(${visible ? minBrightness : "1"})`,
            time: getDuration(),
            easing: 'ease-in-out'
        }
        rootAnimatedElement.animateProperty(animateOptions)
    }

    let getDirection = () => {
        return options?.animation?.direction ?? defaultValues.direction
    }

    onMount(() => {
        isClient = true;
    })


    let y = $derived.by(() => {
        if (!isClient)
            return 0

        let size = window.screen.height;
        switch (getDirection()) {
            case "top":
                return -size;
            case "bottom":
                return size;
            default:
                return 0
        }
    })
    let x = $derived.by(() => {
        if (!isClient)
            return 0

        let size = window.screen.width;
        switch (getDirection()) {
            case "left":
                return -size;
            case "right":
                return size;
            default:
                return 0
        }
    })

    let justify = $derived.by(() => {
        if (!isClient)
            return 'none'
        switch (getDirection()) {
            case "left":
                return "flex-start";
            case "right":
                return 'flex-end';
            default:
                return 'center'
        }
    })


    let align = $derived.by(() => {
        if (!isClient)
            return 'none'
        switch (getDirection()) {
            case "top":
                return "flex-start";
            case "bottom":
                return 'flex-end';
            default:
                return 'center'
        }
    })

    let getSize = $derived.by(() => {
        if (!isClient)
            return {width: "0", height: "0"}
        switch (getDirection()) {
            case "top":
            case "bottom":
                return {width: height, height: size};
            case "left":
            case "right":
                return {width: size, height: height};
        }
    })

    let getDuration = () => {
        return options?.animation?.duration ?? defaultValues.duration
    }

</script>

<div class="root"
     onclick={()=> visible = !visible}
     bind:this={rootElement}>
    {#if visible}
        <div class="window-container"
             style="
             align-items:{align};
             justify-content: {justify};"
             transition:flyWithNoOpacity={{
                 y:y,
                 x:x,
                 easing:easeFunction.cubicOut(),
                 duration:getDuration()}}>

            <Element height={getSize.height}
                   onClick={(e)=>{e.stopPropagation()}}
                   width={getSize.width}
                   direction="column"
                   justify=""
                   align=""
                   background="var(--bg-primary)"
                   radius="var(--radius-strong)"
                   {...panel}
            >

                {#if children}
                    {@render children()}
                {/if}
            </Element>

        </div>
    {/if}
</div>


<style>
    .window-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: all;
        z-index: var(--z-index-1);
    }

    .root {
        height: 100%;
        width: 100%;
        position: fixed;
        pointer-events: none;
        left: 0;
        top: 0;
        z-index: var(--z-index-5);
        backdrop-filter: brightness(100%);
    }
</style>