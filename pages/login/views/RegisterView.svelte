<script lang="ts">
    import FormFieldsLogin from "../components/FormFieldsLogin.svelte";
    import ButtonLogin from "../components/ButtonLogin.svelte";
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Checkbox from "$lib/fluti/components/checkbox/Checkbox.svelte";
    import type {LoginViewProps} from "../loginPageTypes";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import TitleLogin from "$lib/fluti/pages/login/components/TitleLogin.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Label from "$lib/fluti/components/label/Label.svelte";

    let {controller}: LoginViewProps = $props();

    const translation = controller.props.messages.registerView;
    let handleRegister = async () => {

        controller.invalidFields = {}

        if (!controller.form?.email) {
            controller.invalidFields['email'] = translation.fieldCanNotBeEmpty
        }

        if (!controller.form?.password) {
            controller.invalidFields['password'] = translation.fieldCanNotBeEmpty
        }

        if (controller.form?.confirmPassword !== controller.form?.password) {
            controller.invalidFields['confirmPassword'] = translation.passwordsDoesNotMatch
        }

        if (!controller.form?.confirmPassword || controller.form.confirmPassword === '') {
            controller.invalidFields['confirmPassword'] = translation.fieldCanNotBeEmpty
        }

        if (!controller.form?.acceptPolicy) {
            controller.invalidFields['acceptPolicy'] = translation.youMustAccept
        }

        if (!controller.form?.acceptTerms) {
            controller.invalidFields['acceptTerms'] = translation.youMustAccept
        }

        if (Object.keys(controller.invalidFields).length > 0) {
            return false
        }

        let result = await controller.register();
        if (!result) {
            return;
        }
        controller.view = 'email';
    }

</script>


<Element width="100%" height="100%" direction="column" gap="1.5em" padding="2em 0 0 0">


    <h5 style:color={flutiTheme.color.error}>{controller.error}</h5>
    <TitleLogin title={translation.top.title}
                description={translation.top.subtitle}
                icon="fa fa-envelope"
    />
    <FormFieldsLogin
            enablePassword={true}
            enableRepeatPassword={true}
            controller={controller}
            transition={translation}/>

    <Element direction="column" width="100%" align="flex-start">
        <Label error={controller?.invalidFields['acceptPolicy']} gap="0">
            <Checkbox bind:value={controller.form.acceptPolicy}>
                {translation.iAcceptPolicy}
            </Checkbox>
        </Label>

        <Label error={controller?.invalidFields['acceptTerms']} gap="0">
            <Checkbox bind:value={controller.form.acceptTerms}>
                {translation.iAcceptTerms}
            </Checkbox>
        </Label>
    </Element>


    <ButtonLogin
            title={translation.button.title}
            onButtonClick={handleRegister}
            buttonProps={{isLoading:controller.isLoading, disabled:controller.isLoading}}
            onActionClick={() => controller.view = 'login'}
            actionTitle={translation.button.subtitle}/>
</Element>


