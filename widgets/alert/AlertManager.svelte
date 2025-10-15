<script lang="ts">
    import {useAlert} from "./AlertImpl.svelte.ts";
    import Alert from "./Alert.svelte";

    const alerts = useAlert();

</script>

<div class="alerts-container">
    {#each alerts.displayedAlerts as alert (alert.id)}
        <Alert {...alert} destroy={()=> alerts.destroy(alert.id)}/>
    {/each}
</div>

<style>

    .alerts-container {
        position: fixed;
        pointer-events: none;
        z-index: 100000;
        width: 100%;
        gap: 0.5em;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-end;
        padding: 1em;
        padding-top: 10em;
    }
</style>