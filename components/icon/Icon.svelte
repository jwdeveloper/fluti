<script lang="ts">
    import {addRippleEffect} from "../../effects/RippleEffect";
    import {addClickEffect} from "$lib/fluti/effects/ClickEffect";


    let {
        icon = undefined,
        rightIcon = undefined,
        onClick = () => {
        },
        iconColor = '',
        disabled = false,
        children = undefined,
        clickable = true,
        useClickEffect = false,
        useRipplerEffect = true,
        borderVariant = undefined,
        fullWidth = false,
        className = '',
        textCenter = false,
        bordFont = true,
        style = '',
        iconSize = 'normal',
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

    let iconSizeValue = $derived.by(() => {
        if (iconSize === 'normal')
            return 'var(--font-size-desktop)'

        if (iconSize === 'big')
            return 'var(--font-size-big)'

        if (iconSize === 'huge')
            return 'var(--font-size-huge)'

        if (iconSize === 'xxl')
            return '1.8em'


        return 'var(--font-size-normal)'
    })


    function useEffects(element) {
        let cleanup = []

        if (useRipplerEffect) {
            let result = addRippleEffect(element, "var(--text-neutral)", clickable);
            cleanup.push(result)
        }

        if (useClickEffect) {
            let eff = addClickEffect(element)
            cleanup.push(eff)
        }
        return () => {
            cleanup.forEach(fn => fn())
        }

    }


    function addClickEffectUse(element) {
        let cleanup = []
        if (useClickEffect) {
            let eff = addClickEffect(element)
            cleanup.push(eff)
        }
        return () => {
            cleanup.forEach(fn => fn())
        }
    }

    function addRippleEffectUse(element) {
        let cleanup = []
        if (useRipplerEffect) {
            let result = addRippleEffect(element, "var(--text-neutral)", clickable);
            cleanup.push(result)
        }
        return () => {
            cleanup.forEach(fn => fn())
        }
    }


</script>


{#if children}

    <div use:useEffects class=" wide-icon {className}"
         style='
          width: {width};
          height:100%;
          padding:0.6em 1em;
          min-width:{fullWidth?"100%":""};
          grid-template-columns:{template};
          {border}
{style};'
         onclick={handleClick}>
        {#if icon}
            <div style="z-index: var(--z-index-1);
             align-items: center;
             justify-content: flex-start;
             display: flex;
             height: 100%;
              width: 100%; color: {fontColor};">
                <i class='{icon}'/>
            </div>
        {/if}
        {#if children}
            <div style="z-index: var(--z-index-1);
             display: flex;
             height: 100%;
              width: 100%;
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
            <div style="z-index: var(--z-index-1);height: 100%;  width: 100%; color: {iconColor};">
                <i class='{rightIcon}'/>
            </div>

        {/if}
    </div>

{:else }

    <div
            use:addClickEffectUse
                       onclick={handleClick}
            style="
     height: auto; width: auto; overflow: hidden; position: relative" class="{className}">
        <i use:addRippleEffectUse
           class="icon-class"
           style='position: relative;
           overflow: hidden;
            font-size: {iconSizeValue};
             width: {width};  {style}; '>
            <i class="{icon}"
               style="z-index: var(--z-index-2)">
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
            font-size: var(--font-size-big) !important;
        }
    }


    .wide-icon:hover {
        background: var(--bg-tertiary);
        color: var(--text-light);
        border-color: var(--text-light);
    }


    .icon-class {
        padding: 1.2em;
        border-radius: var(--radius-strong);
        display: flex;
        gap: 0.5em;
        justify-content: center;
        align-items: center;
        height: 1em;
        width: 1em;
        transition: all 0.3s ease-in-out;
        position: relative;
        border: var(--border-size) solid var(--text-muted);
        font-size: var(--font-size-desktop);

        @media (max-width: 768px) {
            font-size: var(--font-size-huge);
        }

        @media (max-width: 380px) {
            font-size: var(--font-size-big);
        }

    }

    .icon-class:hover {
        cursor: pointer;
        background: var(--bg-tertiary);
        color: var(--text-light);
        border-color: var(--text-light);

    }
</style>