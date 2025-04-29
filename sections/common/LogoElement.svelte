<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {FooterSectionProps} from "$lib/fluti/sections/footer/types";
    import type {LogoElementProps} from "$lib/fluti/sections/common/types";

    let props: LogoElementProps = $props()
</script>


<Element gap="0.5em">
    {#if props.showLogo}
        <img src={props.url}>
    {/if}
    <Element direction="column" gap="0">
        <h2 style="line-height: 18px">
            {props.name}
        </h2>
        {#if props.slogan}
            <Element width="100%" justify="flex-end">
                <h4 style="font-weight: normal">
                    {props.slogan}
                </h4>
            </Element>
        {/if}
    </Element>
</Element>

<style>
    h2{
        font-size: 1.4rem;
    }

    h4{
        font-size: 0.9rem;
    }
    img {
        height: 60px;
        width: 60px;
        object-fit: cover;
        border-radius: 50%;
    }
</style>