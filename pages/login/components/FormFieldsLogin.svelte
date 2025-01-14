<script lang="ts">
    import Label from "$lib/fluti/components/label/Label.svelte";
    import Input from "$lib/fluti/components/input/Input.svelte";
    import type {LoginController} from "../loginController.svelte";

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
        error={controller.invalidFields?.email}
        title={transition.loginOrEmail ?? 'Login'}>
    <Input bind:value={controller.form.email}
           disabled={controller.isLoading}
           error={controller.invalidFields?.email?true:false}
           placeholder="{transition.loginOrEmail}..."
           type="email"
           icon="fa fa-envelope"/>
</Label>

{#if enablePassword}
    <Label
            error={controller.invalidFields?.password}
            title={transition.password ??'Password'}>
        <Input bind:value={controller.form.password}
               disabled={controller.isLoading}
               error={controller.invalidFields?.password?true:false}
               type="password"
               placeholder="{transition.password}..."
               icon="fa fa-lock"/>
    </Label>
{/if}

{#if enableRepeatPassword}
    <Label title={transition.passwordRepeat ??'Repeat password'}>
        <Input bind:value={controller.form.confirmPassword}
               disabled={controller.isLoading}
               type="password"
               placeholder="{transition.passwordRepeat}..."
               icon="fa fa-lock"/>
    </Label>
{/if}



