<script lang="ts">
    import {useServerRenderConfig} from "$lib/fluti/components/panel/ServerRenderConfig.svelte";
    import {
        createCssClass,
        type ElementProps,
        type ElementStyleProps,
        getClassName
    } from "$lib/fluti/components/panel/ElementProps";
    import {onMount} from "svelte";
    import {addRippleEffect} from "$lib/fluti/effects/RippleEffect";
    import {addClickEffect} from "$lib/fluti/effects/ClickEffect";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";


    //@ts-ignore
    let elementId = $props.id();

    let {
        id,
        tag = 'div',
        element = $bindable(),
        children = undefined,
        attributes,
        onClick,
        ...props
    }: ElementProps = $props()


    const config = useServerRenderConfig
    const className = getClassName(elementId);

    let serverIsMobile = $derived.by(() => {
        breakpoints.isMobile
        return config.serverSide ? config.isMobile : breakpoints.isMobile
    })

    const defaultStyles = $derived.by(() => {
        props
        return {
            background: props?.background,
            display: props?.display,
            color: props?.color,
            gap: props?.gap,
            height: props?.height,
            className: props?.className,
            width: props?.width,
            direction: props?.direction,
            align: props?.align,
            justify: props?.justify,
            rows: props?.rows,
            columns: props?.columns,
            padding: props?.padding,
            radius: props?.radius,
            style: props?.style,
            fontSize: props?.fontSize,
            margin: props?.margin,
            overflow: props?.overflow
        }
    })

    onMount(() => {
        if (!props?.hover)
            return;
        if (!element)
            return;
        const classData = createCssClass(props, className, true);
        // console.log(className)
        const style = document.createElement("style");
        style.type = 'text/css'
        style.innerHTML = classData;
        document.head.appendChild(style);
    })

    let finalStyles: ElementStyleProps = $derived.by(() => {
        breakpoints.isMobile
        breakpoints.isDesktop
        breakpoints.isTablet
        if (serverIsMobile)
            return {...defaultStyles, ...props?.mobile};

        if (breakpoints.isDesktop)
            return {...defaultStyles, ...props?.desktop}

        if (breakpoints.isTablet)
            return {...defaultStyles, ...props?.tablet}

        return defaultStyles;
    })


    let addVisualEffects: (e: HTMLHtmlElement) => void = (element: HTMLHtmlElement) => {
        if (!props?.effects)
            return () => {
            }

        const effectsOptions = props?.effects;
        const effects: any[] = []
        if (effectsOptions?.rippler) {
            element.style.overflow = 'hidden'
            element.style.position = 'relative'
            element.style.cursor = 'pointer'
            effects.push(addRippleEffect(element, effectsOptions?.rippler?.color))
        }
        if (effectsOptions?.click)
            effects.push(addClickEffect(element,effectsOptions?.click?.frames))

        return () => {
            //@ts-ignore
            effects.forEach(cleanUp => cleanUp())
        }
    }

</script>

<svelte:element
        id={id ?? elementId}
        bind:this={element}
        use:addVisualEffects
        this={tag}
        style:background={finalStyles.background}
        style:display={finalStyles.display ?? 'flex'}
        style:height={finalStyles.height}
        style:width={finalStyles.width}
        style:gap={finalStyles.gap}
        style:color={finalStyles.color}
        style:flex-direction={finalStyles.direction}
        style:align-items={finalStyles.align}
        style:justify-content={finalStyles.justify}
        style:grid-template-rows={finalStyles.rows}
        style:grid-template-columns={finalStyles.columns}
        style:padding={finalStyles.padding}
        style:border-radius={finalStyles.radius}
        style:overflow={props?.effects?.rippler ? 'hidden': props.overflow}
        style:font-size={props?.fontSize}
        style:margin={props?.margin}
        onclick={onClick}
        style={finalStyles.style}
        class="scroll element {finalStyles.className} {className} "
        {...attributes}>

    {@render children?.()}
</svelte:element>

<style>
    :global(.element) {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
    }

</style>

