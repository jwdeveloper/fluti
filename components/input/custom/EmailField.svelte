<script lang="ts">
    import Input2 from "$lib/fluti/components/input/Input2.svelte";
    import Label from "$lib/fluti/components/label/Label.svelte";

    let {
        value = $bindable(''),
        required = false,
        label = undefined,
        placeholder = "Wprowadź adres email",
        invalidMessage = 'Nieprawidłowy adres email',
        title = "Email"
    } = $props();

    let invalid = $state(false);
    let errorMessage = $state(invalidMessage);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    $effect(() => {
        value
        if (value === undefined || value === '') {
            invalid = false;
            if (required == true) {
                errorMessage = placeholder;
                invalid = true;
            } else {
                errorMessage = invalidMessage;
            }
            return
        }
        invalid = !emailRegex.test(value);
        errorMessage = invalidMessage;
    })

</script>
<Label title={title}
       labelFor="email_field"
       info="email_field"
       error={errorMessage}
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
            placeholder={placeholder}/>
</Label>