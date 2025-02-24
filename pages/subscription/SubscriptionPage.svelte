<script lang="ts">
    import type {
        PaymentPeriodOptions,
        SubscriptionPageProps,
        SubscriptionPageTranslations, SubscriptionProduct, SubscriptionProductPrice
    } from "$lib/fluti/pages/subscription/types";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import SideWindow from "$lib/fluti/widgets/window/SideWindow.svelte";
    import SubscriptionStripeCheckout from "$lib/fluti/pages/subscription/SubscriptionStripeCheckout.svelte";
    import defaultSubscriptionPageData from "$lib/fluti/pages/subscription/data";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import Skieleton from "$lib/fluti/components/skieleton/Skieleton.svelte";
    import Tabs from "$lib/fluti/components/tabs/Tabs.svelte";
    import {onMount} from "svelte";
    import SubscriptionCard from "$lib/fluti/pages/subscription/SubscriptionCard.svelte";
    import {bestPricePerDay} from "$lib/fluti/pages/subscription/utils";
    import {useAlert} from "$lib/fluti/widgets/alert/AlertImpl.svelte";
    import {useWindow} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte";
    import LoginPopup from "../../../../routes/login/LoginPopup.svelte";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";
    import userSession from "$lib/fluti/server2/middlewares/session/clientUserSession.svelte";

    let {
        productsOptions = defaultSubscriptionPageData.productsOptions ?? [],
        onFetchProducts = defaultSubscriptionPageData.onFetchProducts,
        onMakePayment = defaultSubscriptionPageData.onMakePayment,
        ...props
    }: SubscriptionPageProps = $props();

    let alerts = useAlert()
    let isProductsLoading = $state(false)
    let products: SubscriptionProduct[] = $state([])
    const translations = {...defaultSubscriptionPageData.translations, ...props.translations} as SubscriptionPageTranslations
    const paymentPeriod = [...props.periodOptions ?? defaultSubscriptionPageData.periodOptions ?? []] as PaymentPeriodOptions[]
    let selectedPaymentPeriod = $state(paymentPeriod[0])

    let isPaymentStarted = $state(false)
    const paymentWindow = $state({
        isOpen: false,
        secret: ''
    })

    const loadProducts = async () => {
        await tryExecuteAction(async () => {
            if (!onFetchProducts)
                throw new Error('onFetchProducts method not defined!')
            isProductsLoading = true
            let fetchedProducts = await onFetchProducts({})
            products = fetchedProducts.sort((a: any, b: any) => {
                const n1 = parseInt(a?.meta?.index ?? 0)
                const n2 = parseInt(b?.meta?.index ?? 0)
                return n1 - n2;
            });
            isProductsLoading = false
        })
    }

    const handlePaymentClick = async (event: any) => {
        await tryExecuteAction(async () => {
            if (!onMakePayment)
                throw new Error('onMakePayment method not defined!')

            if (!userSession.isLogin) {
                useWindow(LoginPopup).open()
                return
            }

            isPaymentStarted = true
            const madePayment = await onMakePayment(event)
            paymentWindow.secret = madePayment.secret;
            paymentWindow.isOpen = true;
            isPaymentStarted = false
        })
    }

    const tryExecuteAction = async (action: any) => {
        try {
            await action()
        } catch (e) {
            alerts.pushAlert(e.message + "", 'error')
            isPaymentStarted = false
            isProductsLoading = false
        }
    }

    let displayedProducts: SubscriptionProduct[] = $derived.by(() => {
        let finalProducts = []
        for (let product of products) {
            let productOptions = productsOptions.find(e => e.id === (product?.meta?.id ?? ''));

            if (productsOptions === undefined) {
                finalProducts.push(product)
                continue
            }

            let price: SubscriptionProductPrice | undefined = product.prices?.find(e => e.period === selectedPaymentPeriod.value);
            if (price === undefined) {
                price = {
                    id: '-1',
                    period: '',
                    value: 0,
                    currency: ''
                }
            }

            let finalProduct: SubscriptionProduct = {
                ...product,
                ...productOptions,
                price: price,
                prices: [],
                meta: {...product?.meta, ...productOptions?.meta},
                features: productOptions?.features ?? product?.features ?? [],
                id: product.id
            }
            finalProducts.push(finalProduct)
        }
        return finalProducts
    })

    const getPeriodDescription = $derived.by(() => {
        products
        selectedPaymentPeriod
        if (!selectedPaymentPeriod?.description)
            return ''

        let description = selectedPaymentPeriod?.description;
        let variables = {
            ...bestPricePerDay(displayedProducts, selectedPaymentPeriod)
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
    <SubscriptionStripeCheckout
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
            <Skieleton width="700px"
                       mobile={{width:'100%'}}
                       isLoading={!isProductsLoading} height="25px" radius={flutiTheme.radius.huge}>
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
            <Element width="100%" margin="2em 0">
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
    {@const shouldNotRender = selectedPaymentPeriod.value === 'forever' && product.price?.value === 0}
    {#if !shouldNotRender}
        <svelte:component this={targetComponent}
                          {...product}
                          translations={translations}
                          paymentStarted={isPaymentStarted}
                          paymentPeriod={selectedPaymentPeriod}
                          onClick={handlePaymentClick}/>
    {/if}
{/snippet}


<TitleComponent/>
<PeriodComponent/>
<Element width="100%" gap="1em" mobile={{direction:'column'}}>
    {#if isProductsLoading}
        <Skieleton radius={flutiTheme.radius.medium} height="505px" width="100%"/>
    {:else}
        {#each displayedProducts as product (product.id)}
            {@render CardComponent(product)}
        {/each}
    {/if}
</Element>

