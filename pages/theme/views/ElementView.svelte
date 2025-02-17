<script lang="ts">
    import Input2 from "../../../../../components/input/Input2.svelte";
    import Label from "$lib/fluti/components/label/Label.svelte";

    let input = 'siasdasd'
</script>


<Label title="siema">
    <Input2 variant="filled" bind:value={input}/>
</Label>
