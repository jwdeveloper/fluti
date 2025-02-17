<script lang="ts">
    import FormFieldsLogin from "../components/FormFieldsLogin.svelte";
    import ButtonLogin from "../components/ButtonLogin.svelte";
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Separator from "$lib/fluti/components/separator/Separator.svelte";
    import Checkbox from "$lib/fluti/components/checkbox/Checkbox.svelte";
    import type {LoginViewProps} from "../loginPageTypes";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";

    let {controller, translation}: LoginViewProps = $props();


    let handleRegister = async () => {
        let result = await controller.register();
        if (!result) {
            alert("Błąd rejestracji");
            return;
        }
        controller.view = 'email';
    }

</script>


<Panel direction="column" padding="0" width="100%" height="100%">


    <Separator margin="0.4em 0">
        Utwórz konto
    </Separator>

    <FormFieldsLogin
            enablePassword={true}
            enableRepeatPassword={true}
            controller={controller}
            transition={translation}/>
    <Separator margin="0.4em"/>
    <Checkbox>
        Wyrażam zgode na przetwarzanie danych osobowych
    </Checkbox>

    <Checkbox>
        Wyrażam zgode na przetwarzanie danych osobowych
    </Checkbox>
    <ButtonLogin
            title="Załóż konto"
            onButtonClick={handleRegister}
            onActionClick={() => controller.view = 'login'}
            actionTitle="Powrót do logowania"/>



</Panel>

