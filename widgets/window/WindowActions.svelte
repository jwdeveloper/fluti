<script lang="ts">
    import Button from "$lib/fluti/components/button/Button.svelte";
    import {WindowCloseReason, type WindowHandle} from "./WindowManagerImpl.svelte.js";

    let {
        window, onSave = () => {
        },
        onCancel = () => {
        }
    } = $props();
    let windowInstance: WindowHandle = window;

    let isSaveLoading = $state(false)

    const handleSave = async () => {
        isSaveLoading = true
        let result = await onSave()
        isSaveLoading = false;
        if (result === false)
            return

        windowInstance.close(WindowCloseReason.save)
    }

    const handleCancel = async () => {
        isSaveLoading = true
        let result = await onCancel()
        isSaveLoading = false;
        if (result === false)
            return

        windowInstance.close(WindowCloseReason.cancel)
    }

</script>
<Button isLoading={isSaveLoading} fullWidth={true} variant="btn-filled" onClick={handleSave}>Zapisz</Button>
<Button fullWidth={true} variant="btn-filled" onClick={handleCancel}>Anuluj
</Button>
