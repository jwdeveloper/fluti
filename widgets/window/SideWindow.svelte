<script lang="ts">
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import {onMount} from "svelte";
    import type {AnimatePropertyOptions} from "$lib/fluti/effects/animations/AnimatorExtensions";
    import type {PanelProps} from "$lib/fluti/components/panel/Panel.type";
    import {easeFunction} from "$lib/fluti/utils/ease";
    import {flyWithNoOpacity} from "$lib/fluti/effects/fly";
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
            direction?: "left" | "top" | "bottom" | "right" | 'center' | 'none',
            duration?: number
        },
        allowScroll?: boolean
        allowClose?: boolean
        children?: any,
        id?: string,
        onClose?: (id: string) => void,
        x?: number,
        y?: number
    }

    let {
        children = undefined,
        size = "60%",
        height = "100%",
        visible = $bindable(false),
        panel = {},
        allowClose = true,
        allowScroll = true,
        onClose,
        id,
        ...options
    }: WindowLayer = $props();
    let rootElement: HTMLDivElement;
    let rootAnimatedElement: any;
    let isClient = $state(false);
    let previousVisibleState = false;
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
            previousVisibleState = visible;
            return;
        }
        if (previousVisibleState === visible)
            return;

        if (!rootElement)
            return

        previousVisibleState = visible;
        if (options?.animation?.direction === 'none')
            return;

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

    function handleClick() {
        if (!allowClose)
            return

        if (onClose)
            onClose(id ?? '');

        visible = !visible;
    }

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
        if (allowScroll === false) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    })

    $effect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
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
            case "center":
                return size
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
            case "center":
                return 0
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
            case "center":
                return {width: size, height: height};
        }
    })

    let getDuration = () => {
        return options?.animation?.duration ?? defaultValues.duration
    }

</script>

<!--<LeftRightInteraction onInteraction={(e)=> visible =false}/>-->

<div class="root"
     onclick={handleClick}
     bind:this={rootElement}>
    {#if visible}

        <div class="window-container"
             style="
             align-items:{align};
             justify-content: {justify};"
             transition:flyWithNoOpacity={{
                 y:y,
                 x:x,
                 easing:easeFunction.cubicInOut(),
                 duration:getDuration()}}>

            <Element height={getSize?.height ?? 'auto'}
                     onClick={(e)=>{e.stopPropagation()}}
                     width={getSize?.width ?? 'auto'}
                     direction="column"
                     justify=""
                     align=""
                     background="var(--bg-primary)"
                     radius="var(--radius-strong)"
                     style="position: absolute;
                     top:{options?.y? options.y+'px':''};
                     left: {options?.x? options.x+'px':''}"
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
        min-height: 100vh;
        /*height: auto;*/
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
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