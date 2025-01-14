<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import {loginData} from "./data";
    import {useLoginController} from "./loginController.svelte";
    import LoginView from "./views/LoginView.svelte";
    import RegisterView from "./views/RegisterView.svelte";
    import ErrorView from "./views/ErrorView.svelte";
    import EmailView from "./views/EmailView.svelte";
    import RecoveryView from "./views/RecoveryView.svelte";

    const props: LoginWindowProps = $props();
    const translations = loginData;
    const controller = useLoginController();
    const breakpoints = useBreakpoints();
    onMount(() => {
        controller.props = props;
    })

    const currentView = $derived.by(() => {
        switch (controller.view) {
            case "login":
                return LoginView;
            case "register":
                return RegisterView;
            case "recovery":
                return RecoveryView;
            case "email":
                return EmailView;
            case "error":
                return ErrorView;
            default:
                return LoginView;
        }
    })

    import type {LoginWindowProps} from "./loginWindowTypes";
    import {onMount} from "svelte";
    import {useBreakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";
</script>


<Panel variant="component-panel-border"
       padding="1em 4em 2em 4em"
       width="400px"
       useArrowMovement={true}
       breakpoints={{
           'sm':{width:"100%", height:"100vh",maxWidth:"100%",padding:"0"},
       }}
       gap="0"
       direction="column">

    {#if currentView}
        <div style="padding: 0 2em; width: {breakpoints.breakpoint === 'sm'?'100%':'auto'};">

            <svelte:component this="{currentView}"
                              controller={controller}
                              translation={translations}/>
        </div>

    {/if}
</Panel>
