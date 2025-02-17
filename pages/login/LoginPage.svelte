<script lang="ts">
    import type {LoginPageProps} from "$lib/fluti/pages/login/loginPageTypes";
    import LoginWindow from "$lib/fluti/pages/login/LoginWindow.svelte";
    import {useBreakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    const props: LoginPageProps = $props();
    const breakpoints = useBreakpoints()
</script>


{#if breakpoints.isMobile}
    <Element height="100%"
             width="100%"
             background="var(--bg-primary)"
             align="flex-start"
             justify="flex-start"
             padding="0 5%"
             radius="0">
        <LoginWindow {...props}/>
    </Element>
{:else }
    <Element width="100%" height="100vh" display="grid" columns="1fr 1fr" gap="0">
        <Element height="100%"
                 width="100%"
                 background="var(--bg-primary)"
                 radius="0">
            <Element width="50%" direction="column">
                <LoginWindow {...props}/>
            </Element>
        </Element>

        {#if props?.templates?.pageRightWindowTemplate}
            <svelte:component this={props?.templates?.pageRightWindowTemplate} {...props}/>
        {:else}
            <Element height="100%" background="var(--accent-primary)" radius="0"/>
        {/if}
    </Element>
{/if}