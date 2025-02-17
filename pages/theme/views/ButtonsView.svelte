<script lang="ts">
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import type {Variant} from "$lib/fluti/themes/themeTypes";
    import Section from "$lib/fluti/pages/theme/common/Section.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    let variants: any = ['text', 'outline', 'filled']
    let sizes: Variant[] = ['tiny', 'small', 'medium', 'large', 'huge']
    let icon = 'fa fa-user'
</script>


<Section title="" direction="column">


    <Element width="300px">
        <Button2 fullWidth={true} variant='filled'>
            Sign in
        </Button2>
        <Button2 fullWidth={true} variant='outline'>
            Login is
        </Button2>
        <div>
            <Button2 icon="fa fa-home" variant='outline'/>
        </div>
    </Element>


    <Button2 textSize="h4" icon="fa fa-user" isLoading={true}  fullWidth={true} variant='filled'>
        Login is
    </Button2>

</Section>


<Section title="Variants">
    {#each variants as variant}
        <Button2 isLoading={true} variant={variant}>
            Hello world
        </Button2>
    {/each}
</Section>

<Section title="Variants disabled">
    {#each variants as variant}
        <Button2 isLoading={true} disabled={true} variant={variant}>
            Hello world
        </Button2>
    {/each}
</Section>


<Section title="Sizes" display="grid"
         columns="1fr 1fr 1fr 1fr 1fr"
         mobile={{rows: "1fr 1fr 1fr 1fr 1fr", columns:'1fr'}}
         gap="1em" direction="row">
    {#each variants as variant}
        {#each sizes as size, index}
            <div>
                <Button2 isLoading={true}
                         size={size}
                         icon={icon}
                         variant={variant}>
                    Hello world
                </Button2>
            </div>

        {/each}
    {/each}
</Section>


<Section title="Disabled icons">
    {#each variants as variant}
        <Button2 disabled={true} icon={icon} variant={variant}/>
    {/each}
</Section>


<Section title="Loading icons">
    {#each variants as variant}
        <Button2 isLoading={true} icon={icon} variant={variant}/>
    {/each}
</Section>

<Section title="Icons" display="grid" columns="1fr 1fr 1fr 1fr 1fr" gap="1em" direction="row">
    {#each variants as variant}
        {#each sizes as size, index}
            <Button2
                    size={size}
                    icon={icon}
                    variant={variant}/>
        {/each}
    {/each}
</Section>


