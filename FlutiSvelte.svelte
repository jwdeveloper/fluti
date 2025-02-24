<script lang="ts">
    import ThemeManager from "$lib/fluti/widgets/theme/ThemeManager.svelte";
    import AlertManager from "$lib/fluti/widgets/alert/AlertManager.svelte";
    import WindowManager from "$lib/fluti/widgets/window/WindowManager.svelte";
    import BreakpointManager from "$lib/fluti/widgets/breakpoints/BreakpointManager.svelte";
    import UserManager from "$lib/fluti/widgets/user/UserManager.svelte";

    import './themes/default.css'
    import '../../index.css'


    interface Fluti {
        useThemes?: boolean,
        useWindows?: boolean,
        useAlerts?: boolean,
        useBreakpoints?: boolean,
        useUserSession?: boolean,
    }

    let {
        useThemes = true,
        useWindows = true,
        useBreakpoints = true,
        useAlerts = true,
        useUserSession = true,
    }: Fluti = $props();
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css"/>
    <script async src="https://js.stripe.com/v3/"></script>
</svelte:head>


{#if useAlerts}
    <AlertManager/>
{/if}


{#if useUserSession}
    <UserManager/>
{/if}

{#if useThemes}
    <ThemeManager/>
{/if}

{#if useWindows}
    <WindowManager/>
{/if}

{#if useBreakpoints}
    <BreakpointManager/>
{/if}