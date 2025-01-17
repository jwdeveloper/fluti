<script lang="ts">
    import {addRippleEffect} from "../../effects/RippleEffect";
    import Panel from "$lib/fluti/components/panel/Panel.svelte";


    let {
        icon = undefined,
        rightIcon = undefined,
        onClick = () => {
        },
        iconColor = '',
        disabled = false,
        children = undefined,
        borderVariant = undefined,
        fullWidth = false,
        className = '',
        textCenter = false,
        bordFont = true,
        style = ''
    } = $props();


    function handleClick(event: MouseEvent) {
        event.stopPropagation();
        if (navigator)
            navigator.vibrate(25);

        onClick(event);
    }

    let width = !children ? "1em" : "auto";
    let template = ''

    if (icon)
        template += " auto "
    if (children)
        template += " 1fr "
    if (rightIcon)
        template += " auto "

    if (fullWidth) {
        width = "100%"
    }

    let border = $derived.by(() => {
        let color = ''
        if (borderVariant === 'lime')
            color = 'background: rgba(0,255,0,0.39); border-color: lime;'
        if (borderVariant === 'red')
            color = 'background: rgba(239,26,26,0.38); border-color: red;'
        if (borderVariant === 'blue')
            color = 'border-color: #00eaff; background: rgba(0,234,255,0.27);'
        if (borderVariant === 'yellow')
            color = 'border-color: #fffb00; background: rgba(255, 251, 0, 0.32);'


        return color;
    });

    let fontColor = $derived.by(() => {
        if (borderVariant !== '')
            return 'var(--text-light)'
        return 'var(--text-primary)'
    })

    let data = 'var(--text-primary)'
</script>


{#if children}

    <div use:addRippleEffect={{color:"var(--text-neutral)"}} class="wide-icon {className}"
         style='
          width: {width};
          min-width:{fullWidth?"100%":""};
          grid-template-columns:{template};
          {border}


{style};'
         onclick={handleClick}>
        {#if icon}
            <div style="z-index: var(--z-index-1);
             height: 100%; margin: 0.45em 0; width: 100%; color: {fontColor};">
                <i class='{icon}'>
            </div>
        {/if}
        {#if children}
            <div style="z-index: var(--z-index-1); display: flex; height: 100%; width: 100%;
        text-wrap: nowrap;
         font-weight:{bordFont?'800':'normal'} ;
         line-height: -2em;
        align-items:center;
        color: {fontColor};
           justify-content:{textCenter?'center':'flex-start'};">
                {@render children()}
            </div>
        {/if}
        {#if rightIcon}
            <div style="z-index: var(--z-index-1);height: 100%; margin: 0.45em 0; width: 100%; color: {iconColor};">
                <i class='{rightIcon}'>
            </div>

        {/if}
    </div>

{:else }

    <div style="
     height: auto; width: auto; overflow: hidden; position: relative" class="{className}">


        <i use:addRippleEffect={{color:"var(--text-neutral)"}} onclick={handleClick}
           class="icon-class"
           style='position: relative;
                      width: {width};  {style}; '>
            <i class="{icon}" style="z-index: var(--z-index-2)">
            </i>
        </i>
    </div>


{/if}


<style>

    .wide-icon {
        border-radius: var(--radius-medium);
        gap: 0.7em;
        display: grid;
        grid-template-columns: auto 1fr;
        width: auto;
        padding: 0 0.8em;
        transition: all 0.2s ease-in-out;
        position: relative;
        cursor: pointer;
        color: var(--text-primary);
        background: transparent;
        border: var(--border-size) solid var(--text-muted);

        @media (max-width: 768px) {
            font-size: 1.5em !important;

        }
    }


    .wide-icon:hover {
        background: var(--bg-tertiary);
        color: var(--text-light);
        border-color: var(--text-light);
    }


    .icon-class {
        padding: 1.2em;
        border-radius: 0.8em;
        display: flex;
        gap: 0.5em;
        justify-content: center;
        align-items: center;
        height: 1em;
        width: 1em;
        transition: all 0.3s ease-in-out;
        position: relative;
        border: 2px solid var(--text-muted);
    }

    .icon-class:hover {
        cursor: pointer;
        background: var(--bg-tertiary);
        color: var(--text-light);
        border-color: var(--text-light);

    }
</style>