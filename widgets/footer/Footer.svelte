<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";

    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import * as domain from "node:domain";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import Link from "$lib/fluti/components/Link.svelte";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";
    import type {FooterProps} from "$lib/fluti/widgets/footer/footerTypes";

    let props: FooterProps = $props();
    const currentYear = new Date().getFullYear();
    const currentDomain = props?.domain ?? window?.location?.hostname ?? '';
</script>

{#snippet LogoComponent()}

    {#if props?.templates?.logo}
        {@render props?.templates?.logo()}
    {:else}

        {#if props?.logo}
            <Element direction="row" onClick={()=> window.location.href = '/'}>
                {#if props?.logo?.icon}
                    <i style="font-size: var(--font-size-huge);color: var(--accent-primary)"
                       class="{props?.logo?.icon}"></i>
                {/if}
                <h1 style="text-wrap: nowrap; color: {flutiTheme.background.accent}">
                    {props?.logo?.name ?? domain ?? ''}
                </h1>
            </Element>
        {/if}
    {/if}
{/snippet}

{#snippet SocialMediaComponent()}
    {#each Object.keys(props?.socialMedia ?? {}) as key}
        <Hint title="Visit us on {key}">
            <Button2
                    className="social-button"
                    variant="filled"

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
        mobile={{padding:'2em'}}
        padding="3em 10%">


    <Element width="100%"
             display="grid"
             columns={props?.templates?.center ?  "1fr 3fr 1fr" : "auto 1fr"}
             gap="1em"
             mobile={{columns:"1fr", rows:'1fr', gap:'2em'}}
             rows="1fr">
        <Element
                justify="space-between"
                align="flex-start"
                width="100%"
                height="100%"
                mobile={{height:'auto'}}
                gap="0"
                direction="column">
            <LogoComponent/>
            <h4 style="font-weight: normal">{props?.logo?.slogan ?? ''}</h4>

            {#if breakpoints.isDesktop}
                <Space variant="huge"/>
            {/if}

            <Space variant="huge"/>
            <Element id="footer-media"
                     gap="1em"
                     width="100%"
                     height="100%"
                     mobile={{}}
                     justify="flex-start">
                <SocialMediaComponent/>
            </Element>
        </Element>

        {#if props?.templates?.center}
            <Element height="100%" width="100%">
                {@render props?.templates?.center()}
            </Element>
        {/if}

        <Element width="100%"
                 tag="nav"
                 justify="flex-end"
                 align="flex-start"
                 height="100%"
                 mobile={{direction:'column', gap:'2em'}}>

            {#each props?.links ?? [] as linkSection}
                <Element align="flex-start"
                         width="100%"
                         direction="column">
                    <h3 style="width: 100%;">{linkSection.title}</h3>
                    <Space variant="tiny"/>
                    <ul>
                        {#each linkSection.links as link}
                            <li>
                                <Link url={link.url}
                                      style="font-weight: normal;margin: 0.1em 0">{link.name}</Link>
                            </li>
                        {/each}
                    </ul>
                </Element>
            {/each}
        </Element>


    </Element>

    <Separator/>
    <Element id="footer-logo"
             width="100%"
             display="grid"
             columns="1fr 1fr 1fr"
             mobile={{columns:'1fr', rows:'1fr'}}
             rows="1fr"
             height="100%">
        <div>

        </div>
        <Element width="100%" height="100%">
            <div style="text-align: center;">
                <h4>{props?.logo?.slogan}</h4>
                <a href="https://{currentDomain}" target="_blank"
                   rel="noopener noreferrer">© {currentYear} {currentDomain}</a>
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