<script lang="ts">
    import Input2 from "$lib/fluti/components/input/Input2.svelte";
    import Label from "$lib/fluti/components/label/Label.svelte";

    let {
        value = $bindable(''),
        invalid = $bindable(undefined),
        required = false,
        label = undefined
    } = $props();

    $effect(() => {
        value
        if (value === undefined || value === '') {
            invalid = false;
            if (required == true)
                invalid = true;
            return
        }

        invalid = value.length !== 10;
    })

    let errorMessage = $derived.by(() => {
        if (value?.length == 0) {
            return `NIP musi mieć długość 10 cyfr`
        }
        return `NIP musi mieć długość 10 cyfr. Aktualnie ma: (${value.length})`
    })

</script>

<Label labelFor="nip_field"
       invalid={invalid}
       error={errorMessage}
       title="NIP" {...label}>
    <Input2
            type="number"
            id="nip_field"
            icon="fa fa-briefcase"
            placeholder="Wpisz NIP firmy. NIP powinien mieć dokładnie 10 cyfr"
            required={required}
            invalid={invalid}
            bind:value={value}
    />
</Label>