<script lang="ts">
    import SectionContainer from "$lib/fluti/sections/SectionContainer.svelte";
    import type {FooterSectionProps} from "$lib/fluti/sections/footer/types";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Link from "$lib/fluti/components/Link.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import FooterCompanyInfo from "$lib/fluti/sections/footer/FooterCompanyInfo.svelte";
    import LogoElement from "$lib/fluti/sections/common/LogoElement.svelte";

    const {
        showLogo = true,
        logoUrl = '/favicon.ico',
        linksColumns,
        messages,
        companyInfo,
        commonLinks,
        ...props
    }: FooterSectionProps = $props();

    console.log('LINKS is', props, linksColumns)

    const year = new Date().getFullYear();
</script>

{#snippet PrivacyLinks()}
    <Element gap="3em"
             mobile={{gap:"1em", direction: 'column'}}>
        <Link url="/blog/rodo">
            <h3 style="text-wrap: nowrap;font-weight: 300"> Polityka prywatności</h3>
        </Link>
        <Link url="/blog/regulamin">
            <h3 style="text-wrap: nowrap;font-weight: 300">Warunki Usługi</h3>
        </Link>
        <Link url="/blog/cookies">
            <h3 style="text-wrap: nowrap; font-weight: 300;">Ustawienia cookies</h3>
        </Link>
    </Element>
{/snippet}
{#snippet FooterBottomElement()}
    <Element width="100%"
             height="100%"
             direction="column">
        <Separator/>
        <Space/>
        <Element width="100%"
                 mobile={{gap:'4em', direction: 'column-reverse',}}
                 justify="space-between">
            <Element width="100%"
                     mobile={{justify:'center'}}
                     justify="flex-start">
                <h3 style="font-weight: 300;">
                    © { companyInfo ? companyInfo.companyName : ''} {year} {messages ? messages?.allRightsReserved : ''}</h3>
            </Element>
            {@render PrivacyLinks()}
            <Element width="100%"
                     mobile={{justify:'center'}}
                     justify="flex-end">
                {@render SocialMedia()}
            </Element>

        </Element>
        <Space variant="huge"/>
    </Element>
{/snippet}
{#snippet LinksColumn(item)}
    <Element
            align="flex-start"
            justify="flex-start"
            direction="column">
        <h3 style="text-wrap: nowrap; font-weight: 500; font-size: 1.5rem;">{item.title}</h3>
        <Space variant="small"/>
        <ul style="list-style: none; padding: 0; margin: 0;">
            {#each item.links as link}
                <li style="text-decoration: none">
                    <a href={link.url}>
                        <h3 class="footer-link" style="font-weight: 100;">{link.name}</h3>
                    </a>
                </li>
            {/each}
        </ul>
    </Element>
{/snippet}
{#snippet LogoCustomElement()}
    <LogoElement showLogo={showLogo} url={logoUrl}
                 slogan={companyInfo?.slogan}
                 name={companyInfo?.companyName}/>
    <Space variant="huge"/>
    <Space variant="huge"/>
    <FooterCompanyInfo {...companyInfo}/>
{/snippet}

{#snippet SocialMedia()}
    <Element
            justify="flex-start"
            gap="2em">
        <i style="font-size: 1.8rem;" class="fa fa-brands fa-facebook"/>
        <i style="font-size: 1.8rem;" class="fa fa-brands fa-x"/>
        <i style="font-size: 1.8rem;" class="fa fa-brands fa-linkedin"/>
    </Element>
{/snippet}


<SectionContainer
        tag="footer"
        background="{flutiTheme.background.primary}"
        style="min-height: auto"
        mobile={{padding:'10%'}}
        padding="5% 5% 0"
        {...props}>

    <Element width="100%"
             direction="column"
             align="flex-start"
             mobile={{columns:'1fr', rows:'1fr minmax(50%, auto)'}}
             rows="1fr"
             height="100%">

        <Element
                align="center"
                width="100%"
                mobile={{gap:'3em', direction:'column'}}
                justify="space-between">

            <Element width="100%"
                     mobile={{justify:'center'}}
                     justify="flex-start">
                {@render LogoCustomElement()}
            </Element>

        </Element>

        <Space variant="large"/>
        <Space variant="large"/>
        <Space variant="large"/>


        <Element width="100%"
                 mobile={{style:'width:100%', direction:'column'}}
                 gap="2em"
                 align="flex-start"
                 justify="space-between"
        >
            {#each linksColumns as linkColumn}
                {@render LinksColumn(linkColumn)}
            {/each}
        </Element>

    </Element>

    <!--    <Space variant="huge"/>-->
    <!--    {@render SocialMedia()}-->
    <!--    -->
    <Space variant="huge"/>
    {@render FooterBottomElement()}

</SectionContainer>

<style>
    .footer-link {
        font-weight: 100;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.1s ease-out;
        border-bottom: 2px solid transparent;

    }

    .footer-link:hover {
        color: var(--text-light);
        border-bottom: 2px solid var(--text-light);
    }
</style>