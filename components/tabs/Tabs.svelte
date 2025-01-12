<script lang="ts">

    import {animatedElement} from "$lib/animator/AnimatedElement";

    import type {TabsItem, TabsProps} from "./Tabs";
    import {onMount} from "svelte";

    let {
        items,
        onSelect = (item: TabsItem) => {
        },
        selectedItem = $bindable()
    }: TabsProps = $props();

    let element: HTMLHtmlElement;
    let active = $state(false)
    let step = 100 / items.length;
    const handleActive = (item: TabsItem) => {
        selectedItem = item;
        onSelect(item);
    }

    const getIndex = () => {
        let index = 0;
        for (let item of items) {
            if (selectedItem === undefined)
                break
            console.log(item.name, selectedItem.name)
            if (item.name === selectedItem.name) {
                break
            }
            index++;
        }
        return index;
    }

    $effect(() => {

        let index = getIndex();
        let fn = 'cubic-bezier(0.175, 0.885, 0.320, 1.275)'
        let animator = animatedElement(element);
        animator.left(`${step * index}%`, 500, fn);
    })

    onMount(() => {
        let index = getIndex();

        element.style.width = `${step}%`
        element.style.left = `${index * step}%`
    })


    function handleKeyDown(event: KeyboardEvent, item: TabsItem) {
        if (event.key === "Enter" || event.code === "Enter") {
            event.preventDefault(); // Prevent default behavior if needed
            handleActive(item);
        }
    }

</script>


<div class="container">


    <div bind:this={element} class="btn-bg"/>
    {#each items as item}
        <div tabindex="0"
             class="btn-tab"
             onkeydown={(e)=> handleKeyDown(e,item)}
             onclick={() => handleActive(item)}>
            <i class="{item.icon}"></i>
            <div>
                {item.name}
            </div>
        </div>
    {/each}

</div>


<style>

    .container {
        display: flex;
        gap: 0.1em;
        border-radius: 0.3em;
        border: 4px solid var(--bg-200);
        background: var(--bg-200);
        box-shadow: 0 5px 1em 0.03em var(--shadow);
        font-size: 1.1em;
        position: relative;


        .btn-tab {
            width: 90px;
            font-weight: 600;
            border-radius: 0.3em;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.3em;
            border-right: none;
            cursor: pointer;
            transition: all 300ms ease-in-out;
            font-size: var(--font-size-normaler);
            padding: 0.5em;
            z-index: 555;
            /*border-left: 2px solid var(--bg-300);*/
            border-radius: 0px;

            @media (max-width: 768px) {
                font-size: var(--font-size-huge);
                width: 100px;
            }
        }

        .btn-bg {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 333;
            height: 100%;
            background: var(--bg-100);
            box-shadow: 0 3px 1em 0.1em var(--shadow);
            width: 50%;
            border: none;
            display: flex;
            gap: 0.3em;
            scale: 1.03;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-weight: 600;
            border-radius: 0.3em;
            color: var(--bg-accent);
            font-size: var(--font-size-normaler);
        }
    }
</style>