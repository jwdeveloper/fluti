<script lang="ts">

    import {useUserSession} from "$lib/fluti/services/userSessionController.svelte";
    import {onMount} from "svelte";

    let userService = useUserSession()
    onMount(() => {
        console.log("Loading session...")
        userService.loadSession();
    })
</script>