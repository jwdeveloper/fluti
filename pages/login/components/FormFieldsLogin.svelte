<script lang="ts">
    import Label from "$lib/fluti/components/label/Label.svelte";
    import type {LoginController} from "../loginController.svelte";
    import PasswordInput from "$lib/fluti/pages/login/components/PasswordInput.svelte";
    import Input2 from "$lib/fluti/components/input/Input2.svelte";
    import EmailField from "$lib/fluti/components/input/custom/EmailField.svelte";

    interface FormFieldsProps {
        enablePassword?: boolean,
        enableRepeatPassword?: boolean,
        controller: LoginController
    }

    let {
        controller,
        enablePassword = false,
        enableRepeatPassword = false,
    }: FormFieldsProps = $props();

    let translations = controller.props.messages.form;
</script>


<EmailField
        invalidMessage={translations.email.invalidEmail}
        placeholder={"Email"}
        title={translations.email.title}
        bind:value={controller.form.email}
/>


{#if enablePassword}
    <Label
            error={controller.invalidFields?.password}
            title={translations.password.title}>

        <PasswordInput
                bind:value={controller.form.password}
                id="password"
                disabled={controller.isLoading}
                placeholder={translations.password.subtitle}
                invalid={controller.invalidFields?.password !== undefined}/>

    </Label>
{/if}

{#if enableRepeatPassword}
    <Label
            error={controller.invalidFields?.confirmPassword}
            title={translations.repeatPassword.title}>

        <PasswordInput
                bind:value={controller.form.confirmPassword}
                id="repeat-password"
                disabled={controller.isLoading}
                placeholder={translations.repeatPassword.subtitle}
                invalid={controller.invalidFields?.confirmPassword !== undefined}/>
    </Label>
{/if}



