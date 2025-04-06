<script lang="ts">
    import {WindowCloseReason, type WindowHandle} from "./WindowManagerImpl.svelte.js";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";

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
<Icon onClick={handleSave}>Zapisz</Icon>
<Icon onClick={handleCancel}>Anuluj
</Icon>
