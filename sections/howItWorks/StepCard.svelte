<script lang="ts">

    import type {StepCardProps} from "$lib/fluti/sections/howItWorks/types";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import {onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import {all} from "$lib/fluti/utils/Wait";
    import Counter from "$lib/fluti/components/counter/Counter.svelte";

    let props: StepCardProps = $props();

    let element: HTMLHtmlElement;
    let animationHook;

    onMount(() => {
        animationHook = animatedElement(element);
        animationHook.opacity(0, 0)

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
            animationHook.opacity(1, 800)

        }, 200, 100 + (props.index + 1) * 400)
    }

</script>


<Element height="100%"
         align="flex-start"
         justify="flex-start"
         display="grid"
         padding="2em"
         bind:element={element}
         rows="auto 1fr"
         width="100%">
    <Element gap="1em" justify="flex-start" align="flex-start">
        <h2 style="font-weight: 400; font-size: 6em;">0{props.index + 1}</h2>
    </Element>
    <Element
            height="100%"
            justify="flex-start"
            direction="column" align="flex-start">

        <Element gap="1em" align="flex-start">
            <Button2 icon={props.item.icon}/>
            <h2 style="font-weight: 600">
                {props.item.title}
            </h2>
        </Element>

        <h3 style="font-weight: 100">
            {props.item.description}
        </h3>
    </Element>
    <Space/>
    <Element width="100%" justify="flex-start">
        <!--        <Button2 size="large">Zobacz więcej</Button2>-->
    </Element>
</Element>