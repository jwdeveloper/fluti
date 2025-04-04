<script lang="ts">
    import Input2 from "$lib/fluti/components/input/Input2.svelte";
    import Label from "$lib/fluti/components/label/Label.svelte";

    let {
        value = $bindable(''),
        required = false,
        label = undefined
    } = $props();

    let invalid = $state(false);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    $effect(() => {
        value
        if (value === undefined || value === '') {
            invalid = false;
            if (required == true)
                invalid = true;
            return
        }
        invalid = !emailRegex.test(value);
    })

</script>
<Label title="Email"
       labelFor="email_field"
       info="email_field"
       error="Nieprawidłowy adres email"
       invalid={invalid}
       {...label}
>
    <Input2
            id="email_field"
            icon="fa fa-envelope"
            type="text"
            invalid={invalid}
            bind:value={value}
            required={true}
            placeholder="Wprowadź adres email"/>
</Label>