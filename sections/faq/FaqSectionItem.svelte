<script lang="ts">
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import type {FaqPanelItem, FaqPanelItemAnimation} from "./FaqPanelTypes";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import {onMount} from "svelte";
    import {animatedElement} from "$lib/fluti/effects/animations/AnimatedElement";
    import {vibrate} from "$lib/fluti/utils/Wait";

    interface FaqPanelItemProps {
        item: FaqPanelItem
        index?: number
        animation: FaqPanelItemAnimation
        selected: FaqPanelItem | undefined
    }

    let {
        selected = $bindable(undefined),
        animation,
        index,
        item
    }: FaqPanelItemProps = $props();
    let element: HTMLHtmlElement;

    let isVisible = $derived.by(() => {
        return selected?.question === item?.question;
    })

    $effect(() => {
        isVisible
        if (!isVisible) {
            animatedElement(element).height("0px", animation.speed);
            animatedElement(element).opacity(0, animation.speed / 2);
            return
        }

        animatedElement(element).height(animation.height, animation.speed);
        animatedElement(element).opacity(1, animation.speed / 2);
    })

    onMount(() => {

    })
</script>


<Element tag="summary" height="100%" direction="column"
         justify="flex-start"
         width="100%"
         gap="0"
         align="flex-start">

    <Element width="100%"
             radius={flutiTheme.radius.medium}
             effects={{
                 rippler:{color:flutiTheme.background.secondary}
             }}
             hover={{background:flutiTheme.background.transparent}}
             padding="0.8em 1em 0"
             direction="column"
             onClick={()=>{
                    vibrate()
                     if(selected?.question === item?.question)
                         {
                             selected = undefined
                             return
                         }
                     selected = item
                 }}
             gap="0"
             height="100%"
    >

        <Element width="100%"
                 justify="space-between">

            <Element padding="0 1em">
<!--                <Button2 icon="fa fa-question"-->
<!--                         variant="text"-->
<!--                />-->
<!--                -->
                <h3 style="z-index: 1">{item.question}</h3>

            </Element>
            <Button2
                    onClick={()=>
                     {

                         if(isVisible)
                             {
                                 selected = undefined
                             }
                         else
                             {
                                 selected =item;
                             }
                     }}
                    effects={{click:{}}}
                    variant="text" icon="fa {isVisible?'fa-x':'fa-arrow-down'}" size="medium"/>
        </Element>
        <Space variant="small"/>
        <Separator style="height: 0.02em"/>
    </Element>

    <div>
        <Element direction="column"

                 style="overflow: hidden; opacity: 0; height: 0" bind:element={element}
                 padding="0 2em"
                 justify="flex-start">
            <Space variant="tiny"/>
            <h3 style="font-weight: normal;">{item.answer}</h3>
        </Element>
    </div>
</Element>

