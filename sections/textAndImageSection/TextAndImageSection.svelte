<script lang="ts">
    import type {TestamonialSectionProps} from "$lib/fluti/sections/testamonial/types";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import TextAndImageItem from "$lib/fluti/sections/textAndImageSection/TextAndImageItem.svelte";
    import {onMount} from "svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";
    import SectionContainer from "$lib/fluti/sections/SectionContainer.svelte";
    import type {TextAndImageSectionProps} from "$lib/fluti/sections/textAndImageSection/types";

    let props: TextAndImageSectionProps = $props();
    let activeId: number = $state(0);

    let sectionData = {
        subTitle: "Oczyść umysł",
        title: "Twórz zadania w mgnieniu oka",
        text: "Poświęciliśmy ponad dekadę ulepszając Todoist do tego stopnia, by mógł stać się intuicyjnym menedżerem Twoich myśli. Zapisuj i porządkuj zadania w mgnieniu oka, korzystając ze swobodnego, naturalnego języka."
    }

    let items = [
        {color: "rgba(241,101,14,0.88)", image: '/screenshots/s1.png', ...sectionData},
        {color: "rgba(0,149,255,0.67)", image: '/screenshots/s2.png', ...sectionData},
        {color: "rgba(7,81,222,0.95)", image: '/screenshots/s3.png', ...sectionData},
        {color: "rgba(155,24,220,0.67)", image: '/screenshots/s4.png', ...sectionData},
    ]
    let borderColor = $derived.by(() => {
        return items[activeId].color;
    })

    let item = $derived.by(() => {
        return items[activeId];
    })


    onMount(() => {

        function checkClosestItem() {
            const items = Array.from(document.querySelectorAll(".text-item")) as HTMLElement[];
            let closest = null;
            let closestOffset = Infinity;

            for (let item of items) {
                const rect = item.getBoundingClientRect();
                const offset = Math.abs(rect.top);
                if (offset < closestOffset && rect.top >= 0) {
                    closestOffset = offset;
                    closest = item;
                }
            }
            if (closest) {
                const id = closest.id;
                if (!id)
                    return
                if (id !== activeId) {
                    activeId = parseInt(id);
                }
            }
        }

        window.addEventListener("scroll", checkClosestItem, {passive: true});
        checkClosestItem();
        return () => {
            window.removeEventListener("scroll", checkClosestItem);
        };
    });
</script>


{#snippet MobileImplementation()}
    <SectionContainer>
        <Element
                 direction="column"
                 justify="flex-start">
            {#each items as item, index}
                <TextAndImageItem key={index} subTitleColor={item.color} item={item}/>
                <img alt={item.text} style="border: 0.01em solid {borderColor}" src={item.image}>
                <Space variant="huge"/>
            {/each}
        </Element>
    </SectionContainer>
{/snippet}
{#snippet DesktopImplementation()}
    <div class="root">


        <Element height="auto"
                 direction="column"
                 justify="flex-start">
            <div style="height: 300px"/>
            {#each items as item, index}
                <TextAndImageItem key={index} subTitleColor={item.color} item={item}/>
            {/each}
        </Element>

        <div class="image-root">
            <Element display="block"
                     style="position: sticky"
                     className="sticky-panel"
                     direction="column">
                <img style="
            box-shadow: 0 0 2em 0.01em {borderColor};
            border: 0.01em solid {borderColor}" src={item.image}>
            </Element>
        </div>
    </div>

{/snippet}

{#if breakpoints.isMobile}
    {@render MobileImplementation()}
{:else}
    {@render DesktopImplementation()}
{/if}


<style>

    img {
        height: 50vh;
        width: 100%;
        object-fit: cover;
        transition: all 300ms ease-in-out;
        border-radius: var(--radius-medium);
    }

    .root {
        width: 100%;
        padding: 0 15%;
        display: grid;
        gap: 2em;
        grid-template-columns: 1fr 1fr;
        background: var(--bg-primary);
        padding-bottom: 3em;
    }

    .image-root {
        /*background: green;*/
    }

    :global(.sticky-panel) {
        position: sticky;
        top: 0;

        padding: 1rem;
        /*background: red;*/
        padding-top: 150px;
        /*box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);*/
    }


</style>