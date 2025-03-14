<script lang="ts">
    import type {LabelProps} from "./Label.type.ts";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {fly} from 'svelte/transition'
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

    let {
        title = undefined,
        info = $bindable(""),
        onInfoClick = undefined,
        error = $bindable(undefined),
        children = undefined,
        style = '',
        labelFor = '',
        labelColor = 'var(--text-primary)',
        gap = "0.5em",
    }: LabelProps = $props()

</script>


<Element width="100%"
         gap={gap}

         direction="column"
         style={style}>
    {#if title}
        <h5 style="align-self: flex-start">
            {title}
        </h5>
    {/if}
    {#if children}
        <Element
                tag="label"
                attributes={{for:labelFor}}
                justify="flex-start" width="100%">
            {@render children()}
        </Element>
    {/if}

    {#if error}
        <div transition:fly={{y:-50}} style="width: 100%;">
            <Element
                    padding="0 0.5em"
                    width="100%"
                    gap="0.4em"
                    tag="h5"
                    style="color:var(--text-error);"
                    justify="flex-start">
                <i style="align-self: flex-start; margin-top: 0.4em" class="fa fa-warning"/>
                {error}
            </Element>
        </div>

    {/if}
</Element>

<style>

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