<script lang="ts">
    import Section from "$lib/fluti/pages/theme/common/Section.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties.ts";
    import Input2 from "$lib/fluti/components/input/Input2.svelte";

    let value = $state('hello world')

    let types = [
        '', 'text', 'number', 'email', 'password', 'tel', 'url',
        'search', 'date', 'time', 'datetime-local', 'month', 'week',
        'color', 'file', 'checkbox', 'radio', 'range', 'hidden', 'submit',
        'reset', 'button', 'image'
    ];

</script>

<h2>Input: {value}</h2>

<Section title="" gap="2em">
    <Button2 fullWidth={true} variant="filled" onClick={()=> value ='siema'}>Hello world</Button2>
    <Input2 bind:value={value}/>
    <Input2 type="password"/>
</Section>


<Section title="placeholder" gap="2em">
    <Input2 placeholder="hello word"/>
</Section>


<Section title="disabled" gap="2em">
    <Input2 bind:value={value}/>
</Section>


<Section title="invalid" gap="2em">
    <Input2 type="email" required={true} invalid={true} bind:value={value}/>
</Section>


<Section title="disabled" gap="2em" display="grid" columns="1fr 1fr 1fr 1fr">
    {#each types as type }
        <div>
            <h5>{type}</h5>
            <Input2 type={type} bind:value={value}/>
        </div>
    {/each}
</Section>


<Section title="Variant filled" background={flutiTheme.background.primary} padding="2em"
         radius={flutiTheme.radius.medium}>
    <Input2 placeholder="login..." icon="fa fa-home" variant="filled"/>
</Section>
