<script lang="ts">
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Hint from "$lib/fluti/components/hint/Hint.svelte";
    import Skieleton from "$lib/fluti/components/skieleton/Skieleton.svelte";
    import type {PaginationProps} from "$lib/fluti/widgets/pagination/PaginationProps";
    //@ts-ignore
    import {usePaginationController} from "$lib/fluti/widgets/pagination/PaginationController.svelte";

    const {
        controller = usePaginationController(),
        paginationPosition = 'both',
        loadingTemplate = DefaultLoadingTemplate,
        itemTemplate = DefaultItemTemplate,
        paginationTemplate = DefaultPaginationTemplate,
        errorTemplate = DefaultErrorTemplate,
        children,
        ...props
    }: PaginationProps = $props();


    let minVisiblePages = 5;
    let visiblePagesButton = $derived.by(() => {
        return Math.min(minVisiblePages, controller.pageInfo.totalPages)
    });

    let visiblePages = $derived.by(() => {

        let result: any[] = []
        if (controller.pageInfo.page < visiblePagesButton || controller.pageInfo.totalPages <= minVisiblePages) {
            for (let i = 1; i <= visiblePagesButton; i++) {
                result.push(i)
            }
            return result;
        }


        //@ts-ignore
        let halfSize = parseInt(visiblePagesButton / 2);

        let startPos = controller.pageInfo.page - halfSize;
        if (startPos > controller.pageInfo.totalPages - minVisiblePages) {
            startPos = 1 + controller.pageInfo.totalPages - minVisiblePages;
        }

        for (let i = startPos; i <= controller.pageInfo.page + halfSize; i++) {
            if (i > controller.pageInfo.totalPages)
                continue

            result.push(i)
        }
        return result;
    });


    let handleClick = (page: number) => {

        if (page < 1) {
            page = 1;
        }
        if (page > controller.pageInfo.totalPages) {
            page = controller.pageInfo.totalPages;
        }

        //@ts-ignore
        controller?._props?.onPageSelected(page, controller)
        controller.pageInfo.page = page;
    }

    const postsCount: any[] = [];
    for (let i = 1; i <= controller.pageInfo.itemsPerPage; i++) {
        postsCount.push(i);
    }


</script>


<Element direction="column" width="100%" {...props}>

    {#if paginationPosition === 'top' || paginationPosition === 'both'}
        {@render paginationTemplate?.(controller)}
    {/if}
    <svelte:boundary>
        {#if controller.isLoading}
            {@render loadingTemplate?.()}
        {:else }
            {#each controller.items as item, index (item.id)}
                {@render itemTemplate?.(item, index)}
            {/each}
        {/if}

        {#snippet failed(error, reset)}
            {@render errorTemplate?.(error, reset)}
        {/snippet}
    </svelte:boundary>
    {#if paginationPosition === 'bottom' || paginationPosition === 'both'}
        {@render paginationTemplate?.(controller)}
    {/if}
</Element>


{#snippet DefaultItemTemplate(item, index)}
    <Element height="300px" width="100%" background={flutiTheme.background.primary}>
        <h5>
            {JSON.stringify(item)}
        </h5>
    </Element>
{/snippet}

{#snippet DefaultPaginationTemplate(controller)}
    <Element width="100%"
             gap="0.3em"
             justify="flex-end">

        <Hint title="Previous page">
            <Button2 size="small"
                     effects={{click:{}, rippler:{color:flutiTheme.color.accent}}}
                     iconPosition="left"
                     onClick={()=> handleClick(controller.pageInfo.page - 1)}
                     hover={{background:flutiTheme.background.primary}}
                     icon="fa fa-arrow-left"/>
        </Hint>


        <Button2 size="small"
                 effects={{click:{}, rippler:{color:flutiTheme.color.accent}}}
                 onClick={()=> handleClick(1)}
                 hover={{background:flutiTheme.background.primary}}>
            1
        </Button2>

        <i class="fa-solid fa-circle"
           style="font-size: 0.05em"></i>

        {#each visiblePages as pageNumber, index (pageNumber)}
            <Hint title="Open page">
                <Button2 size="small"
                         effects={{click:{}, rippler:{color:flutiTheme.color.accent}}}
                         onClick={()=> handleClick(pageNumber)}
                         hover={{background:flutiTheme.background.primary}}
                         background={controller.pageInfo.page === pageNumber?flutiTheme.background.accent+' !important':''}
                         variant={controller.pageInfo.page === pageNumber? "filled":"outline"}>
                    {pageNumber}
                </Button2>
            </Hint>
        {/each}


        <i class="fa-solid fa-circle"
           style="font-size: 0.05em"></i>


        <Button2 size="small"
                 effects={{click:{}, rippler:{color:flutiTheme.color.accent}}}
                 onClick={()=> handleClick(controller.pageInfo.totalPages)}
                 hover={{background:flutiTheme.background.primary}}>
            {controller.pageInfo.totalPages}
        </Button2>

        <Hint title="Next page">
            <Button2 size="small"
                     iconPosition="right"
                     effects={{click:{}, rippler:{color:flutiTheme.color.accent}}}
                     onClick={()=> handleClick(controller.pageInfo.page +1)}
                     hover={{background:flutiTheme.background.primary}}
                     icon="fa fa-arrow-right"/>
        </Hint>
    </Element>
{/snippet}

{#snippet DefaultLoadingTemplate()}
    {#each postsCount as number}
        <Skieleton width="100%" height="200px" radius={flutiTheme.radius.huge}/>
    {/each}
{/snippet}

{#snippet DefaultErrorTemplate(error)}
    <Element>
        Error
    </Element>
{/snippet}
