<script lang="ts">
    import {type PanelProps} from "./Panel.type";
    import './panel.css'
    import {useBreakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte.js";
    import {useServerRenderConfig} from "$lib/fluti/components/panel/ServerRenderConfig";
    import {onMount} from "svelte";

    let {
        id,
        tag = 'div',
        element = $bindable(),
        onClick = () => {
        },
        onMouseOver = () => {
        },
        ...props
    }: PanelProps = $props();

    const breakpointsController = useBreakpoints();
    const serverRender = useServerRenderConfig;
    let isClientSideInit = false;


    const propsCopy = $derived.by(() => {
        return {
            style: props.style,
            panelType: props.panelType ?? "flex",
            background: props.background ?? "",
            width: props.width ?? "auto",
            height: props.height ?? "auto",
            radius: props.radius ?? "var(--radius)",
            padding: props.padding,
            margin: props.margin,

            direction: props.direction ?? 'row',
            align: props.align ?? 'center',
            justify: props.justify ?? 'center',
            columns: props.columns,
            rows: props.rows,
            gap: props.gap ?? '0.5em'
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

    //onBreakPointUpdate
    $effect(() => {
        breakpointsController.breakpoint
        updateStyleData(true);
    })

    //onSetupHoverEffect
    onMount(() => {
        if (!props?.hover)
            return;
        // Generate unique class name
        let hoverClass = `hover-${id ?? Math.random().toString(36).substr(2, 9)}`;
        hoverClass = 'hover'

        // Convert hover properties to CSS
        let hoverObject = {...propsCopy, ...props?.hover}
        let hoverStyles = Object.entries(hoverObject)
            .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${value} !important;`)
            .join(" ");

        const style = document.createElement("style");
        style.innerHTML = `.${hoverClass}:hover { ${hoverStyles} }`;
        document.head.appendChild(style);

        //@ts-ignore
        element.classList.add(hoverClass)
    })

    //onPropsUpdate
    $effect(() => {
        propsCopy
        if (!isClientSideInit) {
            isClientSideInit = true
            return;
        }
        updateStyleData(false);
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
</script>

<svelte:element
        id={id}
        bind:this={element}
        this={tag}
        onclick={onClick}
        onmouseenter={(e)=> onMouseOver(true,e)}
        onmouseleave={(e) => onMouseOver(false, e)}
        class="{data.className}  scroll"
        style="
        grid-template-rows: {data.rows};
        grid-template-columns: {data.columns};
        display: {data.panelType};
        flex-direction: {data.direction};
        padding: {data.padding};
        justify-content: {data.justify};
        align-items: {data.align};
        gap: {data.gap};
        width: {data.width};
        max-width:{data.width};
        max-height:{data.maxHeight};
        height: {data.height};
        background:{data.background};
        overflow:{data.overflow};
        border-radius:{data.radius};
        margin:{data.margin};
        {data.style}">
    <slot/>
</svelte:element>


