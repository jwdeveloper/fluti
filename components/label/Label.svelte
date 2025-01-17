<script lang="ts">
    import type {LabelProps} from "./Label.type.ts";
    import Panel from "$lib/fluti/components/panel/Panel.svelte";

    let {
        title = undefined,
        info = $bindable(""),
        onInfoClick = undefined,
        error = $bindable(undefined),
        children = undefined,
        style='',
        labelColor='var(--text-light)',
        gap="0.5em",
    }: LabelProps = $props()

</script>


<Panel width="100%"
       gap="{gap}"
       padding="0"
       direction="column" style={style}>
    {#if title}
        <Panel padding="0" width="100%"
               style="font-weight: bold;
                color: {labelColor}"
               justify="flex-start">
            {title}
        </Panel>
    {/if}
    {#if children}
        <Panel justify="flex-start" width="100%" padding="0">
            {@render children()}
        </Panel>
    {/if}

    {#if error}
        <Panel padding="0 0.2em" width="100%"
               gap="0.4em"
               style="color:var(--text-error);"
               justify="flex-start">
            <i style="align-self: flex-start; margin-top: 0.4em"
               class="fa fa-warning"/>
            <div>
                {error}
            </div>
        </Panel>
    {/if}
</Panel>


<!--<div class="container">-->
<!--    <div class="title">-->
<!--        <h1>{title}</h1>-->
<!--        {#if onInfoClick}-->
<!--            <div class="flex gap-2 icon-container" onclick={onInfoClick}>-->
<!--                <h4 >{info}</h4>-->
<!--            </div>-->
<!--        {/if}-->
<!--    </div>-->


<!--    <div class="content">-->
<!--        <slot/>-->
<!--    </div>-->

<!--    <div class="error-container">-->
<!--        {error}-->
<!--    </div>-->
<!--</div>-->

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