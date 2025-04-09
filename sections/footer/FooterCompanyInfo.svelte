<script lang="ts">
    import type {FooterCompanyInfo, FooterSectionProps} from "$lib/fluti/sections/footer/types";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";

    let props: FooterCompanyInfo = $props();
</script>

<Element direction="column" align="flex-start">

    {#if props.email}
        <h3 style="font-weight: 500; line-height: 6px">
            <i class="fa fa-envelope" style="font-size: 0.8em"></i> Email:
        </h3>
        <h3 style="font-weight: 100; opacity: 0.9">{props.email}</h3>
        <Separator></Separator>
        <Space variant="small"/>
    {/if}

    {#if props.phone}
        <h3 style="font-weight: 500;line-height: 6px ">
            <i class="fa fa-phone" style="font-size: 0.8em"> </i> Telefon:
        </h3>
        <h3 style="font-weight: 100; opacity: 0.9">{props.phone}</h3>
        <Separator></Separator>
        <Space variant="small"/>
    {/if}

    {#if props.address}
        <h3 style="font-weight: 500; line-height: 6px">
            <i class="fa fa-location-dot" style="font-size: 0.8em"></i> Adress:
        </h3>
        <h3 style="font-weight: 100; opacity: 0.9">{props.address}</h3>
    {/if}
</Element>
