<script>
    import Label from "$lib/fluti/components/label/Label.svelte";
    import Input2 from "$lib/fluti/components/input/Input2.svelte";
    import {validators} from "$lib/fluti/utils/validators.js";

    let {
        value = $bindable(''),
        invalid = $bindable(false),
        required = false,
        label = undefined
    } = $props();

    const polishPhoneRegex = /^(?:\+?48\s?)?(?:\d{3}\s?\d{3}\s?\d{3})$/;

    $effect(() => {
        value

        if (required === false && value === '') {
            invalid = false;
            return
        }
        invalid = !polishPhoneRegex.test(value);
    })

</script>

<Label
        error="Nieprawidłowy numer telefonu"
        invalid={invalid}
        title="Telefon" {...label}>
    <Input2
            icon="fa fa-phone"
            regex={validators.phone}
            bind:value={value}
            invalid={invalid}
            placeholder="Wpisz numer telefonu"/>
</Label>


