<script>
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import FlagIcon from "$lib/fluti/widgets/lang/FlagIcon.svelte";
    import FloatingPanel from "$lib/fluti/components/floatingPanel/FloatingPanel.svelte";

    let isClicked = $state(false)
    let selectedCountry = $state("pl")

    $effect(() =>
    {
        selectedCountry
        isClicked = false;
        document.cookie = `i18=${selectedCountry}; path=/`
    })
    let countries = ["us", "pl", "de", "es"]
</script>

<svelte:head>
    <script>
        let i = 12;
    </script>
</svelte:head>


<FloatingPanel isOpen={isClicked}>
    {#snippet headerSlot()}
        <Panel onClick={()=> isClicked = !isClicked}>
            <FlagIcon countryCode="{selectedCountry}"/>
        </Panel>
    {/snippet}

    {#snippet contentSlot()}
        <Panel width="30px" variant="component-panel-border" direction="column">
            {#each countries as country}
                <FlagIcon onClick={()=> selectedCountry=country} countryCode="{country}"/>
            {/each}
        </Panel>
    {/snippet}
</FloatingPanel>
