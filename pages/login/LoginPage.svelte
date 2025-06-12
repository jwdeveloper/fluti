<script lang="ts">
    import type {LoginPageProps} from "$lib/fluti/pages/login/loginPageTypes";
    import LoginWindow from "$lib/fluti/pages/login/LoginWindow.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";

    const props: LoginPageProps = $props();

</script>


{#if breakpoints.isMobile}
    <Element height="100%"
             width="100%"
             style="position: fixed; top: 0; width: 100%; width: 100%; z-index: var(--z-index-5);"
             background="var(--bg-primary)"
             align="flex-start"
             justify="flex-start"
             padding="0 5%"
             radius="0">
        <LoginWindow {...props}/>
    </Element>
{:else }
    <Element width="100%" height="100vh"
             style="position: fixed; top: 0; width: 100%; width: 100%; z-index: var(--z-index-5);"
             display="grid"
             columns="1fr 1fr" gap="0">
        <Element height="100%"
                 width="100%"
                 background="var(--bg-primary)">
            <Element width="50%" direction="column">
                <LoginWindow {...props}/>
            </Element>
        </Element>

        {#if props?.templates?.pageRightWindowTemplate}
<!--            <svelte:WebsocketPanel this={props?.templates?.pageRightWindowTemplate} {...props}/>-->
            {@render props?.templates?.pageRightWindowTemplate()}
        {:else}
            <Element height="100%" background="var(--accent-primary)" radius="0"/>
        {/if}
    </Element>
{/if}