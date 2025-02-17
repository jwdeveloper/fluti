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

{#if useUserSession}
    <UserManager/>
{/if}

{#if useThemes}
    <ThemeManager/>
{/if}

{#if useAlerts}
    <AlertManager/>
{/if}

{#if useWindows}
    <WindowManager/>
{/if}

{#if useBreakpoints}
    <BreakpointManager/>
{/if}