<script lang="ts">
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Title from "$lib/fluti/components/title/Title.svelte";
    import {invokeClickEffect} from "$lib/fluti/effects/ClickEffect";
    import {scale} from "svelte/transition";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let {
        data = undefined,
        onClick,
        onRemove,
        showRemove = false,
        icon = '',
        name = '',
        color = undefined,
        fontSize = '',
        children = undefined,
    } = $props();

    let handleClick = async (e) => {
        if (onClick)
            onClick(e);

        invokeClickEffect(iconElement)
    }

    let handleRemove = async (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (onRemove)
            onRemove(e);
    }

    let iconElement;
    let isMouseOver = $state(false)


    let borderColor = $derived.by(() => {

        let defaultColor = color ?? 'var(--accent-primary)';
        if (data === '' && isMouseOver)
            return 'var(--text-primary)'

        return data !== '' ? defaultColor : 'var(--text-muted)'
    })

    let mouseOver = (s) => {
        isMouseOver = s;
    };

</script>


<Element width="100%"
       ripplerEffect={true}
       align="flex-start"
       className="element-category-card"
       style="z-index: var(--z-index-2)"
       radius="1em"
       padding="1em"
       onClick={handleClick}
       onMouseOver={mouseOver}
       background='var(--bg-transparent)'
       justify="flex-start">
    <Element bind:element={iconElement} style="z-index: var(--z-index-3)">
        <Icon
                style="
                        background: var(--bg-secondary);
                        border-color: {borderColor? 'var(--accent-primary)' : ''};
                       "
                onClick={handleClick}
                clickable={false}
                iconSize="xxl"
                icon='fa {icon}'>
        </Icon>

    </Element>
    {@const isData = data !== ''}
    {#if isData}
        <Element direction="column" gap="0"
               justify="flex-start"
               style="z-index: var(--z-index-3)"
               width="100%"
               align="flex-start">
            <Title tag="h4"
                   lineHeight="1"
                   color="light">
                {name}
            </Title>
            <Title tag="h4"
                   weight="500"
                   color="primary">
                {data}
            </Title>
        </Element>

    {:else}
        <Title
                tag="h4"
                weight="600"
                style="
            z-index: var(--z-index-3);
            color: {isData?'var(--text-primary)':'var(--text-muted)'};
            width: 100%">
            {name}
        </Title>
    {/if}

    {#if showRemove}
        <div in:scale={{duration:250, delay:400}} style="z-index: var(--z-index-3)">
            <Hint title="Usuń">
                <Icon onClick={handleRemove} icon="fa fa-close"></Icon>
            </Hint>
        </div>
    {/if}
</Element>



<style>
    :global(.element-category-card) {
        transition: 200ms ease-in-out;
        background: var(--bg-primary);

    }

    :global(.element-category-card:hover) {
        background: var(--bg-secondary);
    }
</style>