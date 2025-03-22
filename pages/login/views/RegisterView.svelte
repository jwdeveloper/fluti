<script lang="ts">
    import FormFieldsLogin from "../components/FormFieldsLogin.svelte";

    import ButtonLogin from "../components/ButtonLogin.svelte";
    import Checkbox from "$lib/fluti/components/checkbox/Checkbox.svelte";
    import type {LoginViewProps} from "../loginPageTypes";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import TitleLogin from "$lib/fluti/pages/login/components/TitleLogin.svelte";
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

    let handleClickAgree = (e: MouseEvent, link: string) => {
        e.preventDefault()
        e.stopPropagation()
        window.open(link, "_blank");
    }
</script>


{#snippet LinkContent(link, content)}
    <Element>
        {translation.iAgreeTo}
        <h5
                onclick={(e)=>handleClickAgree(e,link)}
                style="
                     font-weight: 900;
                     border-bottom: 1px solid black">
            {content}
        </h5>
    </Element>
{/snippet}


<Element width="100%" height="100%" direction="column" gap="1.5em" padding="2em 0 0 0">


    <h5 style:color={flutiTheme.color.error}>{controller.error}</h5>
    <TitleLogin title={translation.top.title}
                description={translation.top.subtitle}
                icon="fa fa-user"
    />
    <FormFieldsLogin
            enablePassword={true}
            enableRepeatPassword={true}
            controller={controller}
    />

    <Element direction="column" width="100%" align="flex-start">
        <Label error={controller?.invalidFields['acceptPolicy']} gap="0">
            <Checkbox bind:value={controller.form.acceptPolicy}>
                {@render LinkContent(controller?.props?.links?.privacyPolicy ?? "/blog/privacy", controller.props.messages.loginView.rules.policy)}
            </Checkbox>
        </Label>

        <Label error={controller?.invalidFields['acceptTerms']} gap="0">
            <Checkbox bind:value={controller.form.acceptTerms}>
                {@render LinkContent(controller?.props?.links?.privacyPolicy ?? "/blog/terms", controller.props.messages.loginView.rules.terms)}
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


