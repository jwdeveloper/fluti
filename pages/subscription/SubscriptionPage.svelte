<script lang="ts">
    import type {
        PaymentPeriodOptions,
        SubscriptionPageProps,
        SubscriptionPageTranslations, SubscriptionProduct
    } from "$lib/fluti/pages/subscription/types";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import SideWindow from "$lib/fluti/widgets/window/SideWindow.svelte";
    import StripeEmbeddedWindow from "$lib/fluti/pages/subscription/StripeEmbeddedWindow.svelte";
    import defaultSubscriptionPageData from "$lib/fluti/pages/subscription/data";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import Skieleton from "$lib/fluti/components/skieleton/Skieleton.svelte";
    import Tabs from "$lib/fluti/components/tabs/Tabs.svelte";
    import {onMount} from "svelte";
    import SubscriptionCard from "$lib/fluti/pages/subscription/SubscriptionCard.svelte";
    import {bestPricePerDay} from "$lib/fluti/pages/subscription/utils";

    let {
        onFetchProducts = defaultSubscriptionPageData.onFetchProducts,
        onMakePayment = defaultSubscriptionPageData.onMakePayment,
        ...props
    }: SubscriptionPageProps = $props();
    let isProductsLoading = $state(false)
    let products: SubscriptionProduct[] = $state([])
    const translations = {...defaultSubscriptionPageData.translations, ...props.translations} as SubscriptionPageTranslations
    const paymentPeriod = [ ...props.periodOptions ?? defaultSubscriptionPageData.periodOptions ?? []] as PaymentPeriodOptions[]
    let selectedPaymentPeriod = $state(paymentPeriod[0])

    let isPaymentStarted = $state(false)
    const paymentWindow = $state({
        isOpen: false,
        secret: ''
    })

    const loadProducts = async () => {
        isProductsLoading = true
        let fetchedProducts = await onFetchProducts({})
        products = fetchedProducts.sort((a: any, b: any) => {
            let n1 = parseInt(a?.meta?.index ?? 0)
            let n2 = parseInt(b?.meta?.index ?? 0)
            return n1 - n2;
        });
        isProductsLoading = false
    }

    const handlePaymentClick = async (event: any) => {
        isPaymentStarted = true
        let madePayment = await onMakePayment(event)
        paymentWindow.secret = madePayment.secret;
        paymentWindow.isOpen = true;
        isPaymentStarted = false
    }

    const getPeriodDescription = $derived.by(() => {
        products
        selectedPaymentPeriod
        if (!selectedPaymentPeriod?.description)
            return ''

        let description = selectedPaymentPeriod?.description;
        let variables = {
            ...bestPricePerDay(products, selectedPaymentPeriod)
        }
        for (let key in variables) {
            //@ts-ignore
            description = description.replaceAll("{{" + key + "}}", variables[key])
        }
        return description;
    })

    onMount(() => {
        loadProducts()
    })

</script>

<SideWindow
        bind:visible={paymentWindow.isOpen}
        panel={{padding:'0 1em', overflow:'scroll', align:'', justify:'', background:'white'}}
        height={breakpoints.isDesktop?"99%":'100%'}
        size={breakpoints.isDesktop?"60%":'100%'}
        animation={{direction: breakpoints.isDesktop?"center":'right'}}>

    <Element width="100%" justify="flex-start" padding="1em">
        <Button2 color="black" icon="fa fa-arrow-left" onClick={()=> paymentWindow.isOpen =false}>
            {translations.cancel}
        </Button2>
    </Element>
    <StripeEmbeddedWindow
            stripeKey={props.stripePublicKey}
            clientSecret={paymentWindow.secret}/>
</SideWindow>

{#snippet TitleComponent()}
    {#if props?.templates?.titleTemplate}
        {@render props?.templates?.periodTemplate()}
    {:else}
        <Element direction="column" width="100%" gap="0" mobile={{direction:'column', padding:'0 1em'}}>
            <h1 style="font-size: 4em; line-height: 1em; color: {flutiTheme.color.light};">{translations.top.title}</h1>
            <h1 style="font-size: 3em">{translations.top.subtitle}</h1>
            <Space variant="small"/>
            <Skieleton width="700px" isLoading={!isProductsLoading} height="25px" radius={flutiTheme.radius.huge}>
                <h4 style="font-weight: normal">{getPeriodDescription}</h4>
            </Skieleton>
        </Element>
    {/if}
{/snippet}

{#snippet PeriodComponent()}
    {#if props?.templates?.periodTemplate}
        {@render props?.templates?.periodTemplate()}
    {:else}
        {#if breakpoints.isMobile}
            <Element width="100%" margin="2em 0" padding="0 1em">
                <Tabs bind:selectedItem={selectedPaymentPeriod} items={paymentPeriod}></Tabs>
            </Element>
        {:else }
            <Element width="100%" margin="2em 0">
                <div>
                    <Tabs bind:selectedItem={selectedPaymentPeriod} items={paymentPeriod}></Tabs>
                </div>
            </Element>
        {/if}
    {/if}
{/snippet}

{#snippet CardComponent(product)}
    {@const targetComponent = props?.templates?.cardTemplate ?? SubscriptionCard}
    <svelte:component this={targetComponent}
                      {...product}
                      paymentStarted={isPaymentStarted}
                      paymentPlan={selectedPaymentPeriod}
                      onClick={handlePaymentClick}/>
{/snippet}


<TitleComponent/>
<PeriodComponent/>
<Element width="100%" gap="1em" mobile={{direction:'column', padding:'0 1em'}}>
    {#if isProductsLoading}
        <Skieleton radius={flutiTheme.radius.medium} height="500px" width="100%"/>
        <Skieleton radius={flutiTheme.radius.medium} height="500px" width="100%"/>
        <Skieleton radius={flutiTheme.radius.medium} height="500px" width="100%"/>
    {:else}
        {#each products as product}
            {@render CardComponent(product)}
        {/each}
    {/if}
</Element>
