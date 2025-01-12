<script lang="ts">
    import Button from "$lib/fluti/components/button/Button.svelte";
    import {WindowCloseReason, WindowHandle} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte.js";

    let {message, window} = $props()
</script>


<div class="container">
    <div>{message}</div>
    <div class="buttons">
        <Button variant="btn-outline" onClick={()=> window.close(WindowCloseReason.save)}>Tak</Button>
        <Button variant="btn-outline" onClick={()=> window.close(WindowCloseReason.cancel)}>Nie</Button>
    </div>
</div>


<style>
    .container {
        padding: 1em;
        display: flex;
        flex-direction: column;
        gap: 2em;
    }

    .buttons {
        display: flex;
        justify-content: flex-end;
        gap: 1em;
    }

</style>
