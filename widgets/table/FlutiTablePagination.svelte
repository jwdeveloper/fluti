<script lang="ts">
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import {cubicOut} from 'svelte/easing';
    import type {TableController} from "$lib/fluti/components/table/TableImpl.svelte";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";

    const {table}: { table: TableController<any> } = $props();


    function whizz(node: HTMLElement, {from, to}: { from: DOMRect; to: DOMRect }, params: any) {
        const dx = from.left - to.left;
        const dy = from.top - to.top;

        const d = Math.sqrt(dx * dx + dy * dy);

        return {
            delay: 0,
            duration: Math.sqrt(d) * 120,
            easing: cubicOut,
            css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);`
        };
    }

    let data = $state({
        currentPage: 1,
    })
    let pages = $derived.by(() => {
        table.query.pageSize
        if (!table)
            return 0

        return table.query.pageSize;
    })
    let shouldRender = $derived.by(() => pages > 1)
    let displayLimit = 4;

    let pagesToDisplay = $derived.by(() => {
        let pagesList = [];
        let startIndex = Math.max(1, data.currentPage - Math.floor(displayLimit / 2));
        let endIndex = Math.min(pages, startIndex + displayLimit - 1);

        for (let i = startIndex; i <= endIndex; i++) {
            pagesList.push(i);
        }
        return pagesList;
    })

    let nextPage = () => {
        data.currentPage++;
        if (data.currentPage > data.pages)
            data.currentPage = data.pages;
    }
    let previousPage = () => {
        data.currentPage--;
        if (data.currentPage <= 1)
            data.currentPage = 1;
    }


    $effect(() => {
        if (!table)
            return;

        table.query.page = data.currentPage;
        table.fetch();
    })

</script>

{#if shouldRender}
    <Panel justify="flex-end" width="100%" gap="1em" padding="0">
        <Panel gap="0.5em" padding="0">
            <Icon style="font-size: 0.9em" icon="fa fa-arrow-left" onClick={previousPage}/>
            <Icon style="font-size: 0.9em;padding: 0.45em 1em" onClick={()=> data.currentPage = 1}>
                1
            </Icon>
            <!--            <Icon style="font-size: 0.9em;padding: 0.45em 1em">-->
            <!--                ...-->
            <!--            </Icon>-->

        </Panel>
        <div>
            *
        </div>

        <Panel gap="0.5em" padding="0">
            {#each pagesToDisplay as page,index (page)}
                {@const borderColor = page === data.currentPage ? "blue" : ""}
                <div animate:whizz>
                    <Icon borderVariant={borderColor}
                          onClick={()=>data.currentPage = page}
                          style="font-size: 0.9em;padding: 0.45em 1em;overflow: hidden">
                        {page}
                    </Icon>
                </div>

            {/each}
        </Panel>


        <div>
            *
        </div>
        <Panel gap="0.5em" padding="0">
<!--            <Icon style="font-size: 0.9em;padding: 0.45em 1em">-->
            <!--                ...-->
            <!--            </Icon>-->
            <Icon style="font-size: 0.9em;padding: 0.45em 1em"
                  onClick={()=> data.currentPage = pages}>
                {pages}
            </Icon>
            <Icon style="font-size: 0.9em" icon="fa fa-arrow-right"

                  onClick={nextPage}/>
        </Panel>
    </Panel>
{/if}
