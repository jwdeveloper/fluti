<script lang="ts">
    import SectionContainer from "$lib/fluti/sections/SectionContainer.svelte";
    import type {FooterSectionProps} from "$lib/fluti/sections/footer/types";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Link from "$lib/fluti/components/Link.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import FooterCompanyInfo from "$lib/fluti/sections/footer/FooterCompanyInfo.svelte";
    import FooterLogoElement from "$lib/fluti/sections/footer/FooterLogoElement.svelte";
    import {exampleCompoanyInfo, exampleMessages} from "$lib/fluti/sections/footer/exampleData";

    const {
        showLogo = true,
        logoUrl = 'favicon.ico',
        linksColumns = [],
        messages = exampleMessages(),
        companyInfo = exampleCompoanyInfo(),
        ...props
    }: FooterSectionProps = $props();


    const year = new Date().getFullYear();
</script>

{#snippet PrivacyLinks()}
    <Element gap="3em"
             mobile={{gap:"1em", direction: 'column'}}>
        <Link>
            <h3 style="text-wrap: nowrap;font-weight: 300"> Polityka prywatności</h3>
        </Link>
        <Link>
            <h3 style="text-wrap: nowrap;font-weight: 300">Warunki Usługi</h3>
        </Link>
        <Link>
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
                <h3 style="font-weight: 300;">© {year} {messages.allRightsReserved}</h3>
            </Element>
            {@render PrivacyLinks()}
        </Element>
        <Space variant="huge"/>
    </Element>
{/snippet}
{#snippet LinksColumn(item)}
    <Element
            align="flex-start"
            justify="flex-start"
            direction="column">
        <h3 style="text-wrap: nowrap; font-weight: 500; font-size: 1.5em;">{item.title}</h3>
        <Space variant="small"/>
        {#each item.links as link}
            <Link><h3 style="font-weight: 100;">{link.name}</h3></Link>
        {/each}
    </Element>
{/snippet}
{#snippet LogoElement()}
    <FooterLogoElement linksColumns={[]} showLogo={showLogo} logoUrl={logoUrl} companyInfo={companyInfo}/>
    <Space variant="huge"/>
    <Space variant="huge"/>
    <FooterCompanyInfo {...companyInfo}/>
{/snippet}


<SectionContainer
        background="{flutiTheme.background.primary}"
        style="min-height: auto"
        padding="5% 5% 0"
        {...props}>

    <Element width="100%"
             display="grid"
             columns="1.5fr 2.5fr"
             align="flex-start"
             mobile={{columns:'1fr', rows:'1fr minmax(50%, auto)'}}
             rows="1fr"
             height="100%">

        <Element
                align="flex-start"
                width="100%"
                justify="flex-start" height="100%" direction="column">
            {@render LogoElement()}
        </Element>


        <Element width="100%"
                 mobile={{style:'width:100%', direction:'column'}}
                 gap="2em"
                 align="flex-start"
                 justify="flex-end"
        >
            {#each linksColumns as linkColumn}
                {@render LinksColumn(linkColumn)}
            {/each}
        </Element>

    </Element>

    <Space variant="huge"/>
    <Space variant="huge"/>
    {@render FooterBottomElement()}
</SectionContainer>