<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";
    import * as domain from "node:domain";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";

    interface SocialMediaLink {
        url: string
        name?: string
        icon?: string
        iconColor?: string
    }

    interface FooterProps extends ElementProps {
        templates?: {
            logo?: any;
        };
        domain: string
        socialMedia?: {
            linkedIn?: SocialMediaLink
            tweeter?: SocialMediaLink
            facebook?: SocialMediaLink
            tiktok?: SocialMediaLink
            youtube?: SocialMediaLink
        }
        logo?: {
            name?: string;
            slogan?: string;
            image?: string;
        };
        separator?: boolean
    }

    let props: FooterProps = $props();

    const currentYear = new Date().getFullYear();
    const currentDomain = props?.domain ?? window?.location?.hostname ?? '';
</script>

{#snippet LogoComponent()}
    {#if props?.templates?.logo}
        {@render props?.templates?.logo()}
    {:else}
        <Element direction="row" onClick={()=> window.location.href = '/'}>
            <i style="font-size: var(--font-size-huge);color: var(--accent-primary)" class="fa fa-line-chart"></i>
            <h1 style="color: {flutiTheme.background.accent}">
                {props?.logo?.name ?? domain ?? ''}
            </h1>
        </Element>
    {/if}
{/snippet}

{#snippet SocialMediaComponent()}
    {#each Object.keys(props?.socialMedia ?? {}) as key}
        <Hint title="Visit us on {key}">
            <Button2
                    className="social-button"
                    variant="filled"
                    size="large"
                    onClick={()=> window.open(props?.socialMedia[key]?.url ?? '','_blank')}
                    effects={{click:{}}}
                    background={flutiTheme.background.primary}
                    color={props?.socialMedia[key]?.iconColor ?? flutiTheme.background.accent}
                    icon="fa-brands fa-{props?.socialMedia[key]?.icon ?? key}">
            </Button2>
        </Hint>

    {/each}
{/snippet}

{#if props?.separator}
    <Element width="100%" background={flutiTheme.background.tertiary} height="2px"/>
{/if}
<Element
        tag="footer"
        width="100%"
        background={flutiTheme.background.primary}
        margin="{flutiTheme.padding.medium}em 0 0 0"
        gap="1em"
        direction="column"
        padding="3em 10%">


    <Element width="100%"
             display="grid"
             columns="1fr 1fr"
             rows="1fr">
        <Element
                justify="space-between"
                align="flex-start"
                width="100%"
                height="100%"
                gap="0"
                direction="column">
            <LogoComponent/>
            <h3 style="font-weight: normal">{props?.logo?.slogan ?? ''}</h3>
            <Space variant="huge"/>
            <Space variant="huge"/>
            <Element id="footer-media"
                     width="100%"
                     gap="1em"
                     height="100%"
                     justify="flex-start">
                <SocialMediaComponent/>
            </Element>

        </Element>

        <Element width="100%"
                 justify="flex-end"
                 align="flex-start"
                 height="100%"
                 gap="10em">

            <Element align="flex-start" direction="column">
                <h3>Company</h3>
                <h4 style="font-weight: normal">Legal</h4>
                <h4 style="font-weight: normal">Legal</h4>
                <h4 style="font-weight: normal">Legal</h4>
                <h4 style="font-weight: normal">Legal</h4>
            </Element>

            <Element align="flex-start" direction="column">
                <h3>Resources</h3>
                <h4 style="font-weight: normal">Legal</h4>
                <h4 style="font-weight: normal">Legal</h4>
                <h4 style="font-weight: normal">Legal</h4>
                <h4 style="font-weight: normal">Legal</h4>
            </Element>

            <Element align="flex-start" direction="column">
                <h3>Legal</h3>
                <h4 style="font-weight: normal">Terms of service</h4>
                <h4 style="font-weight: normal">Rodo</h4>
                <h4 style="font-weight: normal">Data processing</h4>
                <h4 style="font-weight: normal">Cookies policy</h4>
            </Element>
        </Element>


    </Element>

    <Separator/>
    <Element id="footer-logo"
             width="100%"
             display="grid"
             columns="1fr 1fr 1fr"
             rows="1fr"
             height="100%">

        <!--        <Element id="footer-media"-->
        <!--                 width="100%"-->
        <!--                 gap="1em"-->
        <!--                 height="100%"-->
        <!--                 justify="flex-start">-->
        <!--            <SocialMediaComponent/>-->
        <!--        </Element>-->

        <div>

        </div>
        <Element width="100%" height="100%">
            <div style="text-align: center;">
                <h4>{props?.logo?.slogan}</h4>
                <h4 style="font-weight: normal">© {currentYear} {currentDomain}</h4>
            </div>
        </Element>
    </Element>
</Element>
<!--<Element width="100%" background={flutiTheme.background.accent} height="3px"/>-->
<style>
    :global(.social-button) {

        transition: all 100ms ease-in-out;
    }

    :global(.social-button:hover) {
        scale: 1.2;
    }
</style>