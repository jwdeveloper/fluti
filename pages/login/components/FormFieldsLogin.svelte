<script lang="ts">
    import Label from "$lib/fluti/components/label/Label.svelte";
    import type {LoginController} from "../loginController.svelte";
    import Input2 from "../../../../../components/input/Input2.svelte";

    interface FormFieldsProps {
        transition: any,
        enablePassword?: boolean,
        enableRepeatPassword?: boolean,
        controller: LoginController
    }

    let {
        controller,
        transition = {},
        enablePassword = false,
        enableRepeatPassword = false,
    }: FormFieldsProps = $props();



</script>


<Label
        title='Email or login'
        error={controller.invalidFields?.email}>

    <Input2 bind:value={controller.form.email}
            id="form-login"
            placeholder="Enter email address"
            type="email"
            />

</Label>

{#if enablePassword}


    <Label
            error={controller.invalidFields?.password}
            title={'Password'}>
        <Input2
                id="form-password"
                type="password"
                placeholder="Enter password"
                icon="fa fa-eye"/>

    </Label>
{/if}

{#if enableRepeatPassword}
    <Label title={transition.passwordRepeat ??'Repeat password'}>
        <Input2 bind:value={controller.form.confirmPassword}
                disabled={controller.isLoading}
                type="password"
                placeholder="{transition.passwordRepeat}..."
                icon="fa fa-lock"/>
    </Label>
{/if}



