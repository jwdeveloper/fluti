<script lang="ts">
    import Panel from "$lib/fluti/components/containers/Panel.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Dropdown from "$lib/fluti/components/dropdown/Dropdown.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import {onMount} from "svelte";
    import type {Offer, ProductCardProps} from "$lib/fluti/pages/shop/types";
    import type {DropdownItem} from "$lib/fluti/components/dropdown/dropdownTypes";

    let {
        item,
        selectedOffer = $bindable(undefined),
        imageHeight = 300,
        ...props
    }: ProductCardProps = $props();

    let isInitialized = $state(false)
    let isImageLoadError = $state(false)

    onMount(() => {
        let index = 0;
        for (let offer of item.offers) {
            //@ts-ignore
            offer.temporaryId = index;
            index++;
        }
        isInitialized = true
    })

    const price = $derived.by(() => {
        if (selectedOffer === undefined)
            return -1

        return selectedOffer.price;
    })

    const displayedOffers: Offer[] = $derived.by(() => {
        if (!isInitialized)
            return []
        if (props.onFilterOffers)
            return props.onFilterOffers(item);
        return item.offers;
    })

    const displayedOffersDropBox: DropdownItem[] = $derived.by(() => {
        return displayedOffers.map(e => {
            return {
                name: e?.name ?? '',
                //@ts-ignore
                value: e.temporaryId
            }
        })
    })

    const handleAddToCard = (e: MouseEvent) => {
        if (props?.onAddToCart)
            props.onAddToCart(item, selectedOffer);
    }

    const handleClick = (e: MouseEvent) => {
        if (props?.onSelect)
            props.onSelect(item, selectedOffer);
    }

</script>

{#snippet RenderPrice()}
    {#if price > 0}
        <Element
                margin="-0.5em -0.2em"
                style="
        bottom: 0;
        z-index: 1;
        right: 0;
        position: absolute;">

            <Panel radius={flutiTheme.radius.medium} padding="0.1em 1.5em">
                <h3 style="font-weight: normal; line-height: 1em">
                    <div style="display: flex; gap:0.1em; width: 100%; justify-items: flex-end; align-items: flex-end">
                        {price}zł
                    </div>
                    <div style="font-size: var(--font-size-small)">cena netto</div>
                </h3>
            </Panel>
        </Element>
    {/if}
{/snippet}

{#snippet RenderBadges()}
    <Element
            margin="-0.5em -0.2em"
            align="flex-start"
            direction="row-reverse"
            style="
        top: 5px;
        z-index: 1;
        right: -5px;
        position: absolute;">

        {#each props?.badges ?? [] as badge}
            {#if badge.shouldDisplay(item, selectedOffer)}
                {#if badge?.template}
                    <svelte:component this={badge.template} badge={badge} product={item} offer={selectedOffer}/>
                {:else}
                    <Hint title={badge.hint}>
                        <Button2 variant="filled"
                                 fontSize="0.7em"
                                 icon={badge.icon}
                                 size="tiny">
                            {badge.name}
                        </Button2>
                    </Hint>
                {/if}
            {/if}
        {/each}
    </Element>
{/snippet}

{#snippet RenderImage()}
    {#if isImageLoadError === false}
        <div style="width: 100%; height: 100%; overflow: hidden">
            <Element
                    tag="img"
                    className="element-card-image"
                    effects={{click:{
                            frames:[{scale:0.9,time:150},{scale:1.1,time:150},{scale:1.02,time:200},{scale:1.05,time:100}]
                        }}}
                    attributes={{
                            onerror:()=> { isImageLoadError=true},
                            src:item.image,
                            alt:item.imageAlt
                        }}/>
        </div>
    {:else }

        {#if props?.imageErrorTemplate}
            <svelte:component this={props.imageErrorTemplate}/>
        {:else}
            <Element height="100%" width="100%">
                <i class="fa fa-image" style="color:{flutiTheme.background.shadow}; font-size: 5em"></i>
            </Element>
        {/if}

    {/if}
{/snippet}

{#snippet RenderBuyButton()}
    <Hint title="Dodaj produkt do koszyka">
        <Button2
                variant="filled"
                onClick={handleAddToCard}
                effects={{click:{}}}
                fullWidth={true}
                icon="fa fa-shopping-cart"/>
    </Hint>
{/snippet}
<Panel height="100%"
       width="100%" padding="0"
       align="flex-start"
       gap="0"
       justify="flex-start">

    <Panel width="100%"
           background='{flutiTheme.background.transparent}'
           justify="flex-end"
           onClick={handleClick}
           padding="0"
           style="position: relative;
            max-width: 100%;
            max-height: {imageHeight}px;
            min-height: {imageHeight}px"
           height="{imageHeight}px">
        {@render RenderPrice()}
        {@render RenderBadges()}
        {@render RenderImage()}
    </Panel>


    <Element padding="0.5em 1em 1em 1em"
             width="100%"
             height="100%"
             direction="column" align="flex-start">
        <h4>{item.name}</h4>

        <Element
                width="100%"
                height="100%"
                justify="flex-end"
                align="flex-end">

            {#if item.offers.length > 0}

                {#if props?.offersTemplate}
                    {@render props.offersTemplate(item, displayedOffers)}
                {:else}
                    <Dropdown
                            bind:value={selectedOffer}
                            items={displayedOffersDropBox}
                            placeholder="Wariant produktu">
                    </Dropdown>
                {/if}

                <div>
                    {@render RenderBuyButton()}
                </div>
            {:else }
                {@render RenderBuyButton()}
            {/if}

        </Element>
    </Element>
</Panel>


<style>
    :global(.element-card-image) {
        object-fit: contain;
        width: 100%;
        height: 100%;
        max-height: 300px;
        min-height: 300px;
        aspect-ratio: 1 / 1;
        transition: all 300ms ease-in-out;
        cursor: pointer;
    }

    :global(.element-card-image):hover {
        scale: 1.05;
    }
</style>