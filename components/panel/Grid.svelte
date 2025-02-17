<script lang="ts">
    import {type PanelProps} from "./Panel.type";
    import './panel.css'
    import {useBreakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte.js";
    import {useServerRenderConfig} from "$lib/fluti/components/panel/ServerRenderConfig";
    import {onMount} from "svelte";
    import {addRippleEffect} from "$lib/fluti/effects/RippleEffect";
    import {addClickEffect} from "$lib/fluti/effects/ClickEffect";

    let {
        id,
        tag = 'div',
        element = $bindable(),
        onClick = () => {
        },
        onMouseOver = () => {
        },
        useStyles = true,
        ...props
    }: PanelProps = $props();

    const breakpointsController = useBreakpoints();
    const serverRender = useServerRenderConfig;
    let isClientSideInit = false;


    const propsCopy = $derived.by(() => {
        return {
            // style: props.style,
            panelType: props.panelType,
            background: props.background,
            width: props.width,
            height: props.height,
            radius: props.radius,
            padding: props.padding,
            margin: props.margin,

            direction: props.direction,
            align: props.align,
            justify: props.justify,
            gap: props.gap,
            columns: props.columns,
            rows: props.rows,
            shadow: props.shadow,
            border: props.border,
            className: props.className
        }
    })
    const isMobile = serverRender.isMobile
    const breakpointsMap = {
        "md": undefined,
        "lg": undefined,
        "sm": isMobile ? {...propsCopy, ...props?.sm} : undefined,
        "xl": undefined,
    }
    const styleCache = {}

    //@ts-ignore
    let data: PanelProps = $state(isMobile ? breakpointsMap['sm'] : propsCopy);


    //onSetupHoverEffect
    onMount(() => {
        isClientSideInit = true
        if (!props?.hover)
            return;
        if (!element)
            return;

        const hoverObject = {...propsCopy, ...props?.hover}
        const classData = createCssClass(hoverObject, 'hover', true);
        const style = document.createElement("style");
        style.innerHTML = classData.content;
        document.head.appendChild(style);
        element.classList.add(classData.name)
    })


    function updateStyleData(useCache: boolean) {

        if (useCache && breakpointsController.breakpoint in styleCache) {
            //@ts-ignore
            data = styleCache[breakpointsController.breakpoint]
            return;
        }

        // console.log('updating style', breakpointsController.breakpoint, useCache, id, styleCache)

        if (breakpointsController.breakpoint in breakpointsMap) {
            //@ts-ignore
            let propsBreakpointObject = props[breakpointsController.breakpoint]
            const finalStyles = {...propsCopy, ...propsBreakpointObject}

            //@ts-ignore
            styleCache[breakpointsController.breakpoint] = finalStyles
            //@ts-ignore
            data = finalStyles
            return
        }
        data = propsCopy;
    }

    function addEffects(element: HTMLHtmlElement) {
        let effects = []
        if (props.ripplerEffect) {
            element.style.overflow = 'hidden'
            element.style.position = 'relative'
            effects.push(addRippleEffect(element, props.ripplerEffectColor))
        }
        if (props.useClickEffect)
            effects.push(addClickEffect(element))

        return () => {
            effects.forEach(cleanUp => cleanUp())
        }

    }

    //onBreakPointUpdate
    $effect(() => {
        breakpointsController.breakpoint
        updateStyleData(true);
    })


    //update styles
    $effect(() => {
        propsCopy
        if (!isClientSideInit) {
            return;
        }
        updateStyleData(false);
        Object.entries({
            gridTemplateRows: data.rows,
            gridTemplateColumns: data.columns,
            display: data.panelType,
            flexDirection: data.direction,
            padding: data.padding,
            justifyContent: data.justify,
            alignItems: data.align,
            gap: data.gap,
            width: data.width,
            maxWidth: data.width,
            maxHeight: data.maxHeight,
            height: data.height,
            background: data.background,
            overflow: data.overflow,
            borderRadius: data.radius,
            border: data.border,
            margin: data.margin,
        }).forEach(([key, value]) => {
            if (value !== undefined) {
                element.style[key] = value;
            }
        });

        if (data.style) {
            element.style.cssText += data.style;
        }

    })

    const styleMap = {
        panelType: "display",
        background: "background",
        width: "width",
        height: "height",
        radius: "border-radius",
        padding: "padding",
        margin: "margin",
        direction: "flex-direction",
        align: "align-items",
        justify: "justify-content",
        columns: "grid-template-columns",
        rows: "grid-template-rows",
        gap: "gap",
        shadow: "box-shadow",
        border: "border",
    };

    let createCssClass = (classData: any, name: string, isHover: boolean) => {
        let hoverClass = `${name}-${id ?? Math.random().toString(36).substr(2, 9)}`;
        let styles = Object.entries(classData)
            .filter(([key, value]) => value !== undefined && value !== '' && styleMap[key])
            .map(([key, value]) => `${styleMap[key]}: ${value};`)
            .join(' ')
        if (classData.style) {
            styles += ` ${data.style}`;
        }

        return {
            name: hoverClass,
            content: `.${hoverClass}${isHover ? ':hover' : ''} { ${styles} }`
        }
    }
    const stylesServer = createCssClass(data, "grid", false);
    const classContent = `<style> ${stylesServer.content} </style>`
</script>

<svelte:head>
    {@html classContent}
</svelte:head>

<svelte:element
        id={id}
        bind:this={element}
        use:addEffects
        this={tag}
        onclick={onClick}
        onmouseenter={(e)=> onMouseOver(true,e)}
        onmouseleave={(e) => onMouseOver(false, e)}
        class="scroll grid-element {stylesServer.name} {data.className}">
    <slot/>
</svelte:element>

<style>
    :global(.grid-element) {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
    }
</style>
