<script lang="ts">
    import {onMount} from "svelte";
    import {supabase} from "$lib/supabase-client";
    import SearchBox from "$lib/fluti/components/searchbox/SearchBox.svelte";

    const loading = async () => {

        if (isLoading)
            return
        isLoading = true;
        previousInput = input
        try {
            // @ts-ignore
            let query = supabase.schema(schema).from(table).select('*');
            let queryInput = input; //making copy of input variable
            if (queryInput !== '') {
                query = query.like('name', `%${queryInput}%`)
            }
            query = query.limit(limit);

            let {data, error} = await query;
            if (error) {
                items = []
                isLoading = false;
                return []
            }
            items = data.map(e => {
                return {
                    text: e.name,
                    value: e.id
                }
            });
        } catch (error) {

        }
        isLoading = false;
        if (input != previousInput) {
            loading();
        }

    }

    let {
        limit = 20,
        schema = 'public',
        table = 'Role',
        selected = $bindable({}),
        value = $bindable({text: undefined, value: undefined}),
        ...rest
    } = $props();

    let input = $state('')
    let isLoading = $state(false)
    let items = $state([])
    let previousInput: string | undefined = undefined


    $effect(() => {
        if (input === previousInput)
            return

        loading()
    })


</script>

<SearchBox
        bind:input={input}
        bind:selected={selected}
        bind:value={value}
        enableDefaultSearch={false}
        items={items}
        {...rest}/>
