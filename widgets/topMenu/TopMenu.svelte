<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Link from "$lib/fluti/components/Link.svelte";

    interface TopMenuProps {
        height?: number;
        width?: string;
        logo?: string;
    }

    let {height = 70,
        width = "70%",
        logo = 'favicon.png'}: TopMenuProps = $props();


</script>


{#snippet Logo()}
    <img src={logo} alt="logo" style="height: {height-height*0.2}px;"/>
{/snippet}

<div style="position: fixed; width: 100%; top: 0; left: 0; right: 0; z-index: var(--z-index-3);">
    <Panel width="100%"
           background="var(--bg-secondary)"
           height='{height}px'>
        <Panel
                panelType="grid"
                columns="auto 1fr auto"
                width={width}
        >

            <Panel padding="0 1em">
                <Logo/>
            </Panel>
            <Panel>

                <Panel justify="space-around" align="center" gap="3em">
                    <Link>
                        <h3>O nas</h3>
                    </Link>
                    <Link>
                        <h3>Cennik</h3>
                    </Link>
                    <Link>
                        <h3>Kontakt</h3>
                    </Link>
                </Panel>
            </Panel>

            <Panel padding="0 1em">
                <Icon>Zaloguj się</Icon>
            </Panel>

        </Panel>

    </Panel>
</div>
