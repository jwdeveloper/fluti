<script lang="ts">
    import Grid from "$lib/fluti/components/panel/Grid.svelte";
    import {onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";

    const items = [
        {
            name: 'Wyszukiwarka',
            link: '/'
        },
        {
            name: 'Cennik',
            link: '/'
        },
        {
            name: 'Statystyki',
            link: '/'
        },
        {
            name: 'Kontakt',
            link: '/profile'
        }]
    let element: HTMLHtmlElement;
    let aElement: any;

    let isBackVisible = $state(false)

    onMount(() => {
        aElement = animatedElement(element)
    })

    let targetElement: HTMLHtmlElement

    let setElementSource = async (element) => {
        setElemenet(element)
        let width = targetElement.clientWidth + "px"

        let time = 300;

        aElement.width(width, time)
        aElement.left(targetElement.offsetLeft + "px", time)

    }

    let setElemenet = (element) => {
        targetElement = element.srcElement
    }

    let handleEnter = async (a, event) => {
        let enteredElement: HTMLHtmlElement = document.elementFromPoint(event.clientX, event.clientY);
        if (isBackVisible === false && a === true && enteredElement) {
            if (enteredElement.classList.contains('menu-item')) {
                await aElement.width(enteredElement.clientWidth + "px", 0)
                await aElement.left(enteredElement.offsetLeft + "px", 0)
            }
        }

        isBackVisible = a;
        if (!isBackVisible)
            aElement.opacity(0, 200)
        else
            aElement.opacity(1, 0)

    }

</script>


{#snippet MenuItem(item)}
    <a href={item.link??"/"} class="menu-item" onmouseenter={setElementSource}>
        {item.name}
    </a>
{/snippet}

{#snippet FloatingBackground()}
    <Grid

            style="position: absolute; pointer-events: none"
            height="100%"
            radius="var(--radius-strong)"
            bind:element={element}
            background="var(--bg-transparent)">

    </Grid>

{/snippet}

<Grid padding="0 1em"
      style="position: relative"
      onMouseOver={handleEnter}
      justify="space-around" align="center">
    {#each items as item}
        {@render MenuItem(item)}
    {/each}
    {@render FloatingBackground()}
</Grid>

<style>
    .menu-item {
        padding: 0.9em 1.5em;
        border-radius: var(--radius-strong);
        cursor: pointer;
        transition: all 200ms ease-in-out;
        z-index: var(--z-index-2);
        font-weight: bold;
    }

    .menu-item:hover {
        color: var(--text-light);
    }
</style>