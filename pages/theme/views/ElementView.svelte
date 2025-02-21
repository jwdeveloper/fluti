<script lang="ts">
    import Label from "$lib/fluti/components/label/Label.svelte";
    import Input2 from "$lib/fluti/components/input/Input2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import MobileDesktopLayout from "$lib/fluti/widgets/layout/MobileDesktopLayout.svelte";

    let input = 'siasdasd'
</script>


<Label title="siema">
    <Input2 variant="filled" bind:value={input}/>
</Label>


<MobileDesktopLayout>

    {#snippet center()}
        <Element width="300px" mobile={{width:'100px',background:'green'}} height="300px" background="red">

        </Element>
    {/snippet}
</MobileDesktopLayout>