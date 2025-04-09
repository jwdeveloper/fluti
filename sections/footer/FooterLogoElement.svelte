<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {FooterSectionProps} from "$lib/fluti/sections/footer/types";

    let props: FooterSectionProps = $props()
</script>


<Element gap="1.6em">
    {#if props.showLogo}
        <img src={props.logoUrl}>
    {/if}
    <Element direction="column" gap="0">
        <h1 style="line-height: 32px">
            {props.companyInfo.companyName}
        </h1>
        {#if props.companyInfo.slogan}
            <Element width="100%" justify="flex-end">
                <h4 style="font-weight: normal">
                    {props.companyInfo.slogan}
                </h4>
            </Element>
        {/if}
    </Element>
</Element>

<style>
    img {
        height: 80px;
        width: 80px;
        object-fit: cover;
        border-radius: 50%;
    }
</style>