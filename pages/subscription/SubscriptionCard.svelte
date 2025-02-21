<script lang="ts">
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import {getCurrencySymbol} from "../../../../routes/prices/data";

    export interface SubscriptionCardProps {
        id?: string
        name?: string
        description?: string
        prices?: any[]
        features?: string[]
        popular?: boolean
        currency?: string
        meta?: {
            badge?: string
        }
        paymentPlan?: string
        paymentStarted?: boolean,
        onClick?: (variant: any) => void
    }

    const {
        id = '',
        name = '',
        popular = true,
        prices = [],
        description = '',
        features = [],
        paymentStarted = false,
        onClick = () => {
        },
        paymentPlan = 'monthly',
        ...props
    }: SubscriptionCardProps = $props();


    let isLoading = $state(false)

    $effect(() => {
        paymentStarted
        if (paymentStarted === false)
            isLoading = false
    })

    let getPrice = $derived.by(() => {
        if (!prices || prices.length === 0)
            return {
                price: '0',
                currency: "usd"
            };

        let items = prices.filter(e => e.interval === paymentPlan.value);
        if (items.length === 0)
            return {
                price: '0',
                currency: "usd"
            };

        return items[0];
    })

    let getPriceValue = $derived.by(() => {
        return formatNumberString(getPrice.price + '');
    })

    function formatNumberString(numStr) {
        if (!/^\d+$/.test(numStr)) {
            return numStr;
        }
        const len = numStr.length;
        if (len <= 2) {
            const formatted = '0.' + numStr.padStart(2, '0');
            return formatted === '0.00' ? '0' : formatted;
        }
        const integerPart = numStr.slice(0, len - 2);
        const decimalPart = numStr.slice(-2);
        return decimalPart === '00' ? integerPart : `${integerPart}.${decimalPart}`;
    }


</script>

{#snippet PopularBadge(text)}
    <Element
            padding="0.1em 0.6em"
            radius={flutiTheme.radius.medium}
            fontSize={flutiTheme.font.small}
            background={flutiTheme.background.accent}
            color={flutiTheme.color.accent}>
        {text}
    </Element>
{/snippet}


<Element
        height="100%"
        width="100%"
        direction="column"
        gap="0.8em"
        background={flutiTheme.background.primary}
        radius={flutiTheme.radius.large}
        style="position: relative; border:{props?.meta?.badge?'2px solid var(--accent-primary)':''} "
        padding="1.5em">


    <Element width="100%">

        <Element direction="column"
                 gap="0"
                 width="100%"
                 justify="flex-start"
                 align="flex-start">
            <Element>
                <h3 style="color: {flutiTheme.color.light}">{name}</h3>
                {#if props?.meta?.badge}
                    {@render PopularBadge(props?.meta?.badge)}
                {/if}
            </Element>
            <h4 style="font-weight: normal">Dla użytkowników</h4>
        </Element>

        <Element justify="flex-end"
                 width="100%" height="100%">

            <Button2 effects={{}}
                     style="cursor: default"
                     icon="fa fa-crown"/>
        </Element>
    </Element>

    <Element gap="0.1em" width="100%" justify="flex-start" align="flex-end">
        <h1 style="line-height: 1.2em; color: {flutiTheme.color.light}">{getPriceValue}</h1>
        <h4>
            {getCurrencySymbol(getPrice.currency)}/{paymentPlan?.formated}
        </h4>
    </Element>

    <Element direction="column" width="100%">
        <Button2 fullWidth={true}
                 effects={{
                         rippler:{
                             color:'white'
                         },
                         click:{}}}

                 isLoading={isLoading}
                 disabled={props.prices[0].price == 0 || paymentStarted}
                 variant={!props?.meta?.badge?'outline':"filled"}
                 onClick={()=>{
                     isLoading =true
                     let data ={
                        productId: id,
                        priceId: getPrice.id,
                     }
                     onClick(data)
                 }}
                 style="border-radius: 2em;font-weight: bold; margin-top: 0.5em">
            Wybierz
        </Button2>
    </Element>
    <Space/>

    <Element direction="column" align="flex-start" width="100%">
        {#each features as feature (feature)}
            <Element>
                <div class="fa fa-check" style:color={flutiTheme.background.accent} style="font-size: 0.9em"/>
                <div>
                    {feature.name}
                </div>
            </Element>
        {/each}
    </Element>
    <Element width="100%" height="100%" align="flex-end" justify="flex-end">
    </Element>

</Element>
