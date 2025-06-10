<script lang="ts">
    import {onMount} from "svelte";
    import userSession from "$lib/fluti/server2/middlewares/session/clientUserSession.svelte";

    onMount(() => {
        console.log("Loading website session...", userSession.loadSession())
    })
</script>