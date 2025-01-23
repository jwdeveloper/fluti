<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Title from "$lib/fluti/components/title/Title.svelte";
    import IconCard from "../../../../routes/game/elements/IconCard.svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import {invokeClickEffect} from "$lib/fluti/effects/ClickEffect";

    let {
        data = undefined,
        onClick,
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


<Panel width="100%"
       ripplerEffect={true}
       align="flex-start"
       className="element-category-card"
       style="z-index: var(--z-index-2)"
       radius="1em"
       padding="1em"
       onClick={handleClick}
       onMouseOver={mouseOver}
       justify="flex-start">
    <Panel bind:element={iconElement} style="z-index: var(--z-index-3)">
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

    </Panel>
    {@const isData = data !== ''}
    {#if isData}
        <Panel direction="column" gap="0"
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
            <!--{#if children}-->
            <!--    {@render children()}-->
            <!--{/if}-->
        </Panel>

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

</Panel>


<style>
    :global(.element-category-card) {
        transition: 200ms ease-in-out;
    }

    :global(.element-category-card:hover) {
        background: var(--bg-secondary);
    }
</style>