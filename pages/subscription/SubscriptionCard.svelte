<script lang="ts">
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import {formatNumberString, getCurrencySymbol} from "$lib/fluti/pages/subscription/utils";
    import type {
        PaymentPeriodOptions,
        SubscriptionPageTranslations,
        SubscriptionProduct
    } from "$lib/fluti/pages/subscription/types";

    export interface SubscriptionCardProps extends SubscriptionProduct {
        paymentStarted?: boolean,
        paymentPeriod: PaymentPeriodOptions
        translations: SubscriptionPageTranslations
        onClick?: (variant: any) => void
    }

    const {
        id = '',
        price,
        features = [],
        paymentStarted = false,
        meta,
        translations,
        paymentPeriod,
        onClick = () => {
        },
        ...props
    }: SubscriptionCardProps = $props();


    let isLoading = $state(false)

    $effect(() => {
        paymentStarted
        if (paymentStarted === false)
            isLoading = false
    })

    let getPriceValue = $derived.by(() => {
        return formatNumberString(price?.value + '');
    })

    let badge = $derived.by(() => {
        meta
        return {
            value: meta?.badge ?? false,
            text: meta?.badge ?? '',
            color: meta?.badgeColor ?? flutiTheme.background.accent
        }
    })


</script>

{#snippet Badge()}
    <Element
            padding="0.1em 0.6em"
            radius={flutiTheme.radius.medium}
            fontSize={flutiTheme.font.small}
            background={badge.color}
            color={flutiTheme.color.accent}>
        {badge.text}
    </Element>
{/snippet}



<Element
        height="100%"
        width="100%"
        direction="column"
        gap="0.8em"
        background={flutiTheme.background.primary}
        radius={flutiTheme.radius.large}
        style="max-width: 33.3%;  position: relative; border:{badge.value?'2px solid '+badge.color:''} "
        padding="1.5em">


    <Element width="100%">
        <Element direction="column"
                 gap="0"
                 width="100%"
                 justify="flex-start"
                 align="flex-start">
            <Element>
                <h3 style="color: {flutiTheme.color.light}">{props.name}</h3>
                {#if badge.value}
                    {@render Badge()}
                {/if}
            </Element>
            <h5 style="font-weight: normal">{props.subtitle}</h5>
        </Element>

        <Element align="flex-start"
                 justify="flex-end"
                 height="100%">

            {#if meta?.icon}
                <Button2 effects={{}}
                         style="cursor: default"
                         color={badge.value? flutiTheme.background.accent : ''}
                         icon={meta.icon}/>
            {/if}
        </Element>
    </Element>

    <Element gap="0.1em" width="100%" justify="flex-start" align="flex-end">
        <h1 style="line-height: 1.2em; color: {flutiTheme.color.light}">{getPriceValue}</h1>
        <h4>
            {getCurrencySymbol(price.currency)}/{paymentPeriod?.formated ?? ''}
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
                 disabled={price.value ===0 || paymentStarted}
                 variant={!badge.value?'outline':"filled"}
                 onClick={()=>{
                     isLoading =true
                     let data ={
                        productId: id,
                        priceId: price.id,
                     }
                     onClick(data)
                 }}
                 style="border-radius: 2em;font-weight: bold; margin-top: 0.5em">
            {translations.select}
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

