<script lang="ts">
    import {fly} from "svelte/transition";
    import {addArrowController} from "../../effects/ArrowController";
    import type {FloatingPanelProps} from "./FloatingPanelType";

    let {
        isOpen = $bindable(false),
        offset="110%",
        headerSlot,
        contentSlot
    }: FloatingPanelProps = $props();

    let rootElement: HTMLDivElement;
    let wrapperElement: HTMLDivElement;
    let id = Math.random() + "";

    const findParent = (element: HTMLDivElement) => {

        let root: HTMLDivElement | null = element;
        while (root !== null) {
            if (root === rootElement)
                return true;

            if (root.id === rootElement.id)
                return true;
            //@ts-ignore
            root = root.parentElement;
        }
        return false;
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (!rootElement)
            return;

        if (e.target === null)
            return;


        if (e.target === wrapperElement) {
            isOpen = false;
            return;
        }
        if (findParent(e.target as HTMLDivElement)) {
            return;
        }


        isOpen = false;
    }

</script>


<svelte:window onclick={handleClickOutside}/>

<div class="root" bind:this={rootElement} id={id}>
    <div>
        {@render headerSlot()}
    </div>
    {#if isOpen}
        <div class="wrapper"
             bind:this={wrapperElement}
             in:fly={{}}
             out:fly={{duration:100}}
             style={offset?'top:'+offset+';':''}
             use:addArrowController={{target:'input'}}>
            {@render contentSlot()}
        </div>
    {/if}
</div>


<style>
    .root {
        position: relative;
        width: 100%;
    }

    .wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: var(--z-index-3);
    }
</style>