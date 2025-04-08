<script lang="ts">
    import type {TestamonialElementProps} from "$lib/fluti/sections/testamonial/types";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import {range} from "$lib/fluti/utils/range";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";
    import {onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import {all, wait} from "$lib/fluti/utils/Wait";

    let {item, index, ...props}: TestamonialElementProps = $props();
    let stars = range(item.stars);

    let element: HTMLHtmlElement;
    let animationHook;

    onMount(() => {
        animationHook = animatedElement(element);
        animationHook.opacity(0, 0)
        animationHook.move("0, 300px", 0)

        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    animate();
                    observer.unobserve(element);
                }
            }
        }, {
            threshold: 0.5,
        });

        if (element) {
            observer.observe(element);
        }

        return () => {
            observer.disconnect();
        }
    })

    async function animate() {
        animationHook = animatedElement(element);

        animationHook.scale(1)

        await all(() => {
            animationHook.move("0, 0px", 700)
            animationHook.opacity(1, 800)

        }, 200, 100 + (index + 1) * 30)

    }

</script>

{#snippet Stars()}
    <Element
            justify="flex-start"
            align="flex-start"
            width="100%"
            gap="0.3em">
        {#each stars as range}
            <i class="fa fa-star" style="font-size: 1.3em"></i>
        {/each}
    </Element>
{/snippet}

{#snippet UserInfo()}
    <Element direction="column"
             height="100%"
             justify="flex-start"
             align="flex-start">
        <img src={item.picture}>
        <Space variant="small"/>
        <h3 style="line-height: 1em">{item.name}</h3>
        <h4 style="font-weight: 200">{item.position}</h4>
        <h3 style="font-weight: 200">{item.companyName}</h3>
    </Element>
{/snippet}

<Panel
        bind:element={element}
        direction="column"
        align="flex-start"
        display="grid"
        columns="1fr"
        rows="1fr 1fr"
        height="100%"
        {...props}
>

    <Element direction="column">

        {@render Stars()}
        <Space variant="small"/>
        <Element width="100%"
                 justify="flex-start"
                 align="flex-start"
                 height="100%">
            <p style="font-weight: 400; font-size: 1.5em !important;">
                "{item.quote}"
            </p>
        </Element>
        <Space/>
    </Element>

    {@render UserInfo()}
</Panel>

<style>
    img {
        height: 70px;
        width: 70px;
        object-fit: cover;
        border-radius: 50%;
    }
</style>

