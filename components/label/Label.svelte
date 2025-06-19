<script lang="ts">
    import type {LabelProps} from "./Label.type.ts";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {fly} from 'svelte/transition'
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

    let {
        title = undefined,
        description = undefined,
        onInfoClick = undefined,
        error = undefined,
        children = undefined,
        style = '',
        invalid = false,
        labelStyle = '',
        labelFor = '',
        fullHeight = false,
        labelColor = 'var(--text-primary)',
        gap = "0.5em",
    }: LabelProps = $props()

    let warnings: string[] = $state([])

    if (typeof error === 'string')
        warnings.push(error)
    else if (error !== undefined)
        warnings.push(...error);


</script>

{#snippet Warning(error, index)}
    <div transition:fly={{y:-50, delay:index*100}} style="width: 100%;">
        <Element
                padding="0 0.5em"
                width="100%"
                gap="0.4rem"
                tag="h5"
                color={flutiTheme.color.error}
                justify="flex-start">
            <i class="fa fa-warning"/>
            <div>
                {error}
            </div>
        </Element>
    </div>
{/snippet}

<Element width="100%"
         gap={gap}
         height={fullHeight?'100%':"auto"}
         direction="column"
         style={style}>
    {#if title}
        <label
                for="{labelFor}"
                style="align-self: flex-start; color: {labelColor}; {labelStyle}">
            {title}
        </label>
    {/if}
    {#if children}
        <Element
                tag="label" style="z-index: 1;"
                justify="flex-start" width="100%" height={fullHeight?'100%':"auto"}>
            {@render children()}
        </Element>
    {/if}

    {#if invalid}
        {#each warnings as warning, index}
            {@render Warning(warning, index)}
        {/each}
    {:else if description}
        <Element width="100%" justify="flex-start" align="flex-start">
            <div style="font-size: var(--font-size-tiny); color: {labelColor};">{description}</div>
        </Element>
    {/if}
</Element>

<style>


    label
    {
        font-size: var(--font-size-small);
    }
    .error-container {
        color: red;
        min-height: 0.5em;
        /*text-wrap: nowrap;*/
    }

    .icon-container {
        justify-self: flex-end;
        color: var(--bg-400);
        transition: all 0.3s ease-in-out;
        padding: 0 0.5em;
    }

    .icon-container:hover {
        cursor: pointer;
        background: var(--bg-200);
        border-radius: 0.3em;
    }

    .title {
        display: flex;
        justify-content: space-between;

        @media (max-width: 768px) {
            display: grid;
        }
    }

    .container {
        flex-direction: column;
        gap: 0.5em;
        width: 100%;
        height: 100%;
        display: grid;
    }

    .content {
        gap: 0.5em;
        display: flex;
    }
</style>