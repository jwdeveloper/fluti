<script lang="ts">
    import {type PanelProps} from "./Panel.type";

    import './panel.css'
    import {addRippleEffect} from "../../effects/RippleEffect";
    import {onMount} from "svelte";
    import {useBreakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte.js";
    import {addArrowController} from "../../effects/ArrowController";
    import {addClickEffect} from "$lib/fluti/effects/ClickEffect";


    let {
        panelType = 'flex',
        direction = 'row',
        padding = '',
        className = '',
        gap = '1em',
        align = 'center',
        justify = 'center',
        columns = "",
        columnsAuto = "",
        rows = "",
        rowsAuto = "",
        width = "",
        height = "",
        variant = "normal",
        background = "",
        maxHeight = "",
        radius = "var(--radius)",
        overflow = "",
        style = "",
        id = "",
        tag = "div",
        margin = '',
        useClickEffect = false,
        ripplerEffect = false,
        useArrowMovement = false,
        ripplerEffectColor = '',
        element = $bindable(),
        breakpoints = undefined,
        onClick,
        onMouseOver = () => {
        }
    }: PanelProps = $props();

    let breakpointsController = useBreakpoints();

    let cacheService = new Map<string, string>();
    let computedStyles = $state(getCurrentBreakPoint())
    $effect(() => {
        if (!breakpoints)
            return
        computedStyles = getCurrentBreakPoint();
    })

    function getCurrentBreakPoint() {

        if (!breakpoints)
            return '';

        if (cacheService.has(breakpointsController.breakpoint)) {
            return cacheService.get(breakpointsController.breakpoint);
        }

        let styles = breakpoints[breakpointsController.breakpoint] ?? undefined
        if (styles === undefined) {
            return '';
        }

        let str = ''
        for (let key in styles) {
            str += `${camelToKebab(key)}:${styles[key]};`
        }
        cacheService.set(breakpointsController.breakpoint, str)
        return str;
    }

    function camelToKebab(camelCaseString) {
        return camelCaseString
            .replace(/([a-z])([A-Z])/g, '$1-$2') // Insert a dash between lowercase and uppercase letters
            .toLowerCase(); // Convert the entire string to lowercase
    }

    function addEffects(node: HTMLHtmlElement) {
        let onDestroy = [];
        if (ripplerEffect) {
            let m = addRippleEffect(node, ripplerEffectColor);
            onDestroy.push(m)
            node.style.cursor = 'pointer';
        }


        if (useArrowMovement) {
            onDestroy.push(addArrowController(node, element));
        }

        if (useClickEffect) {
            onDestroy.push(addClickEffect(node));
        }

        return () => {
            onDestroy.forEach((f) => f())
        }
    }

    function handleClick(event: MouseEvent) {
        if (!onClick)
            return

        if (ripplerEffect) {
            if (navigator)
                navigator.vibrate(25);

        }
        event.stopPropagation();
        onClick(event);
    }


    let getColumns = $derived.by(() => {
        if (!columnsAuto)
            return columns;
        return calucalteAutoValue(columnsAuto);
    })
    let getRows = $derived.by(() => {
        if (!rowsAuto)
            return rows;
        return calucalteAutoValue(rowsAuto);
    })


    function calucalteAutoValue(value: string) {
        let split = value.split(" ");
        let type = "fit"
        let r1 = "auto";
        let r2 = "1fr"
        if (split.length == 1) {
            r1 = split[0]
        }
        if (split.length == 2) {
            r1 = split[0]
            r2 = split[1]
        }
        if (split.length == 3) {
            type = split[0]
            r1 = split[1]
            r2 = split[2]
        }
        return `repeat(auto-${type}, minmax(${r1}, ${r2}))`
    }

</script>

<svelte:element this={tag}
                onclick={handleClick}
                id="{id}"
                use:addEffects
                bind:this={element}
                onmouseenter={(e)=> onMouseOver(true,e)}
                onmouseleave={(e) => onMouseOver(false, e)}
                class=" {variant} {className} common component-panel scroll"
                style="
grid-template-rows: {getRows};
grid-template-columns: {getColumns};

display: {panelType};
flex-direction: {direction};
        padding: {padding};
        justify-content: {justify};
        align-items: {align};
        gap: {gap};
        width: {width};
        max-width:{width};
        max-height:{maxHeight};
        height: {height};
        background:{background};
        overflow:{overflow};
        border-radius:{radius};
        margin:{margin};
        {style}
     {computedStyles}

">
    <slot/>
</svelte:element>


<style>

    .common {
        position: relative;
    }


    :global(.border-modern) {
        border: 0.13em solid var(--text-muted) !important;
        border-radius: 0.6em !important;
    }

    :global(.border) {
        border: 2px solid var(--bg-tertiary) !important;
        border-radius: 0.5em;
        transition: all 0.3s ease-in-out;
    }

    :global(.border:hover) {
        box-shadow: 0 0 1em 0.3em var(--shadow);
    }

    :global(.border-color) {
        transition: all 0.3s ease-in-out;
    }

    :global(.border-color:hover) {
        box-shadow: inset 0px 0px 0.1em 0.05em var(--bg-accent-darker);

    }
</style>