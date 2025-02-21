<script lang="ts">
    import {onDestroy, onMount} from "svelte";
    import {generateUUID} from "$lib/fluti/utils/Wait";

    interface StripeEmbeddedWindowProps {
        clientSecret: string
        stripeKey: string
    }

    let {clientSecret, stripeKey}: StripeEmbeddedWindowProps = $props();
    let stripeEmbeddedCheckout: any = undefined
    const stripeEmbeddedCheckoutId = `checkout-${generateUUID()}`

    onMount(() => {
        mountAsync();
        onDestroy(() => {
            if (!stripeEmbeddedCheckout)
                return
            stripeEmbeddedCheckout.destroy();
        })
    })

    async function mountAsync() {
        //@ts-ignore
        const client = Stripe(stripeKey);
        let fetchClientSecretMethod = async () => clientSecret
        stripeEmbeddedCheckout = await client.initEmbeddedCheckout({
            fetchClientSecret: fetchClientSecretMethod,
        });
        console.log(stripeEmbeddedCheckout)
        stripeEmbeddedCheckout.mount(`#${stripeEmbeddedCheckoutId}`);
    }
</script>
<div id={stripeEmbeddedCheckoutId} style="width: 100%; height: 100%;"/>

