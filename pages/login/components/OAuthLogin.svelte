<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import {onMount} from "svelte";


    interface OAuthLoginProps {
        icons?: boolean;
        onClick: (provider: string) => void;
        // items?: ProviderOption[];
    }

    interface ProviderOption {
        provider: string;
        iconColor: string;
        borderColor: string;
    }

    let {icons = $bindable(false), onClick}: OAuthLoginProps = $props();


    const breakpoints = useBreakpoints()
    const items: ProviderOption[] = $state([])
    const Element = $derived.by(() => {

        if (breakpoints.breakpoint != 'sm') {
            return OAuthIcon;
        }
        return OAuthButton;
    })

    const onHandleClick = (provider: string) => {
        onClick(provider)
    }
    onMount(() => {

        items.push({
            provider: "Google",
            iconColor: "red",
            borderColor: "red"
        })

        items.push({
            provider: "Facebook",
            iconColor: "#1877F2",
            borderColor: "#1877F2"
        })
        items.push({
            provider: "Discord",
            iconColor: "#5865F2",
            borderColor: "#5865F2"
        })
    })
    import {scale as Effect} from "svelte/transition";
    import {useBreakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
</script>


<Panel width="100%"
       padding="1em 0"
       gap="0.9em"
       justify="space-around"
       align="center"
       direction="{breakpoints.breakpoint != 'sm'?'row':'column'}">

    {#each items as item,index}
        <div style="width: 100%" transition:Effect={{delay:index*120}}>
            {@render Element(item.provider, item.iconColor, item.borderColor)}
        </div>
    {/each}
</Panel>


{#snippet OAuthIcon(name, color, borderColor)}
    <Hint title="Zaloguj się poprzez {name}">

        <Panel
                onClick={() => onHandleClick(name)}
                padding="0" width="100%" style="cursor: pointer">

            <Panel
                    panelType="grid"
                    height="50px"
                    width="50px"
                    padding="1.2em"
                    radius="50% !important"
                    className="oauth-button"
                    style="
                  border: 3px solid {borderColor} !important;
        box-shadow: 0px 0px 0.9em 0.05em {borderColor};

"
                    breakpoints={{
                sm:{columns:"1fr 1fr",minWidth:"50px", padding:"1em"},
                md:{fontSize:"1.6em"}
                }}

                    ripplerEffect={true} variant="component-panel-border">

                <i class="fa-brands fa-{name.toLowerCase()}"
                   style="color: {color};z-index: 4;">
                </i>
            </Panel>
        </Panel>
    </Hint>
{/snippet}


{#snippet OAuthButton(name, color, borderColor)}
    <Icon
            onClick={() => onHandleClick(name)}
            style="background: var(--bg-primary);
            padding:0.7em 0;
             margin:0.05em 0; "
            textCenter={true}
            boldFont={false}
            fullWidth={true}>
        <Panel width="60%">
            <Panel width="100%"
                   panelType="grid"
                   columns="auto 1fr">
                <i class="fa-brands fa-{name.toLowerCase()}"
                   style="
                     width: 1em;
                    color: {color};font-size:1.6em; z-index: 4"></i>
                <div style="color: var(--text-light)">
                    Sing up with {name}
                </div>
            </Panel>
        </Panel>

    </Icon>
{/snippet}


<style>
    :global(.oauth-button) {
        transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    :global(.oauth-button:hover) {
        scale: 1.1;
        background: var(--bg-tertiary) !important;
        box-shadow: 0px 0px 0.5em 0.1em var(--text-muted);
    }
</style>