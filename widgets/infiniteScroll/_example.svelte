<script lang="ts">
    import InfiniteScrollView from "$lib/fluti/widgets/infiniteScroll/InfiniteScrollView.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import Skieleton from "$lib/fluti/components/skieleton/Skieleton.svelte";
    import {useInfiniteScrollController} from "$lib/fluti/widgets/infiniteScroll/InfiniteScrollController.svelte";

    const scroll = useInfiniteScrollController();
    scroll.onBatchRequested = async (index) => {
        return [{name: 'siema'}, {name: 'siema'}, {name: 'siema'}, {name: 'siema'}];
    }

</script>


<InfiniteScrollView
        controller={scroll}
        threshold={600}
        container={{
                gap:"0.2em",
                justify:'flex-start',
                height:'100%',
                width:'100%',
                mobile:{ gap:"1em" }}}>

    {#snippet itemTemplate(item, index)}

        <Element height="200px" width="100%">
            <h1>{index}</h1>
        </Element>
    {/snippet}

    {#snippet loadingTemplate()}
        {#each name as number}
            <Skieleton radius={flutiTheme.radius.large} height="220px" width="100%"/>
        {/each}
    {/snippet}

    {#snippet noResultsTemplate()}
        <Space/>
        <Space/>
        <Element direction="column"
                 justify="center"
                 width="100%"
                 align="center">
            <h2>Nie znaleziono wyników</h2>
            <h2>spróbuj użyć innych filtrów 😉</h2>
        </Element>
    {/snippet}
</InfiniteScrollView>


