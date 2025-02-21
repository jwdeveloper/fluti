<script lang="ts">
    import type {Button2Props} from "$lib/fluti/components/button/Button";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import {vibrate} from "$lib/fluti/utils/Wait";

    const {
        variant = 'outline',
        disabled = $bindable(false),
        isLoading = $bindable(false),
        loadingOptions = {
            showText: true,
            showIcon: true,
        },
        fullWidth = false,
        icon = undefined,
        size = 'medium',
        iconPosition = 'left',
        textSize = 'div',
        isShowText = true,
        className,
        onClick,
        ...props
    }: Button2Props = $props();

    const defaultEffects = {rippler: {color: flutiTheme.background.shadow}}
    const effects = {...defaultEffects, ...props?.effects}

    function handleClick(event: MouseEvent) {
        if (!onClick)
            return

        event.stopPropagation();
        vibrate();
        onClick(event);
    }

    const variantClass = $derived.by(() => {

        switch (variant) {
            case 'filled':
                return 'btn-element-filled'
            case 'outline':
                return 'btn-element-outline';
        }
        return ''
    })

    const padding = $derived.by(() => {

        let padding = `--padding-${size}`

        if (props.children === undefined)
            return `var(--padding-medium)`


        let leftRightPadding = '1em'
        if (size === 'huge')
            leftRightPadding = "2em"

        if (size === 'large')
            leftRightPadding = "1.5em"

        return `var(${padding}) ${leftRightPadding}`
    })

    const fontSize = $derived.by(() => {
        if (props?.children) {
            return `var(--font-size-medium)`
        }
        return `var(--font-size-${size})`
    })

    const isIcon = $derived.by(() => {
        return props?.children === undefined
    })
</script>


{#snippet IconSlot(position)}
    {@const loadingIcon = "fa fa-spinner fa-spin"}
    {#if position === iconPosition}
        {#if isLoading && loadingOptions?.showIcon === false}
            <svelte:element this={textSize} class={loadingIcon}/>
        {:else if icon !== undefined}
            <svelte:element this={textSize} class={icon}/>
        {/if}

    {:else }
        {#if isLoading && loadingOptions?.showIcon === true}
            <svelte:element this={textSize} class={loadingIcon}/>
        {/if}
    {/if}
{/snippet}

{#snippet ButtonContent()}

    <Element style="z-index: var(--z-index-1)">

        {@render IconSlot("left")}

        {@const isLoadingIcon = isLoading && loadingOptions.showText}
        {@const isElement = props?.children && !isLoading}
        {#if isShowText && (isLoadingIcon || isElement)}
            <svelte:element this={textSize}>
                {@render props?.children()}
            </svelte:element>
        {/if}

        {@render IconSlot("right")}
    </Element>

{/snippet}

{#snippet IconContent()}
    {@const finalIcon = !isLoading ? icon : "fa fa-spinner fa-spin"}
    <i class={finalIcon}></i>
{/snippet}

<Element
        tag="button"
        padding={padding}
        width={fullWidth?'100%':'auto'}
        fontSize={fontSize}
        effects={effects}
        className="btn-element {isIcon?'btn-icon-element':''} {variantClass} {className}"
        gap="1em"
        attributes={{disabled:disabled}}
        onClick={handleClick}
        {...props}>

    {#if isIcon}
        {@render IconContent()}
    {:else}
        {@render ButtonContent()}
    {/if}

</Element>

<style>

    :global(.btn-element) {
        cursor: pointer;
        border-radius: var(--radius-large);
        gap: 1em;
        transition: all 200ms ease-in;
        color: var(--text-primary);
        -webkit-tap-highlight-color: transparent;

        border-top: 1px solid var(--bg-tertiary);
        border-bottom: 4px solid var(--bg-tertiary);

        i {
            z-index: var(--z-index-1);
        }

        h5 {
            z-index: var(--z-index-1);

        }
    }


    :global(.btn-icon-element) {
        border-radius: 40%;
        height: 3em !important;
        width: 3em !important;
    }


    :global(.btn-element:disabled) {
        cursor: not-allowed !important;
        opacity: var(--opacity-medium);
    }

    :global(.btn-element:hover) {
        color: var(--text-light);
        background: var(--bg-transparent);
    }


    :global(.btn-element-outline), :global(.btn-element-filled) {
        border: var(--border-size-medium) solid var(--bg-tertiary);
        border-bottom: 4px solid var(--bg-tertiary);

    }

    :global(.btn-element-outline:hover) {
        border-color: var(--text-muted);
        background: var(--bg-transparent);

        border-color: color-mix(in srgb, var(--bg-tertiary) 80%, black 20%);

    }


    :global(.btn-element-outline) {
        background: inherit;
    }


    :global(.btn-element-filled) {
        background: var(--accent-primary);
        border-color: color-mix(in srgb, var(--accent-primary) 60%, black 30%);
        border-bottom-color: color-mix(in srgb, var(--accent-primary) 60%, black 30%);

        color: var(--accent-color)
    }

    :global(.btn-element-filled:hover) {
        background: color-mix(in srgb, var(--accent-primary) 80%, black 20%);

        border-color: color-mix(in srgb, var(--accent-primary) 60%, black 80%);
        border-bottom-color: color-mix(in srgb, var(--accent-primary) 60%, black 80%);


        color: var(--accent-color);


    }

</style>
