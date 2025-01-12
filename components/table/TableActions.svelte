<script lang="ts">

    import Button from "$lib/fluti/components/button/Button.svelte";
    import type {TableController} from "./TableImpl.svelte.js";
    import {useWindow, WindowCloseReason} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte.js";
    import QuestionWindow from "$lib/fluti/pages/questionWindow/QuestionWindow.svelte";
    import {useAlert} from "$lib/fluti/widgets/alert/AlertImpl.svelte.js";


    let {
        onInsert = (e: MouseEvent) => {
        }, onUpdate = (e: MouseEvent) => {
        }, onDelete = (e: MouseEvent) => {
        },
        table
    } = $props();

    let window = useWindow(QuestionWindow);
    let alerts = useAlert();

    let tableInstance = table as TableController<any>

    const handleInsert = (e: MouseEvent) => {
        onInsert(e)
    }

    const handleUpdate = (e: MouseEvent) => {

        let selected = tableInstance.selected;
        if (selected.length === 0) {
            alerts.pushAlert("Nie wybrano żadnego elementu", '', 1000)
            return
        }
        onUpdate({
            mouseEvent: e,
            items: selected,
            table: tableInstance
        })
    }

    const handleDelete = async (e: MouseEvent) => {
        let selected = tableInstance.selected;
        if (selected.length === 0) {
            alerts.pushAlert("Nie wybrano żadnego elementu", '', 1000)
            return
        }

        let props = {
            message: `Czy napewno chcesz usunąć ${selected.length} pozycji`
        }
        let result = await window.open(props)
        if (result.closeReason !== WindowCloseReason.save)
            return

        for (let item of selected) {
            tableInstance.delete(item)
        }

        if (!onDelete)
            return

        tableInstance.isLoading = true;
        try {
            await onDelete({
                mouseEvent: e,
                items: selected,
                table: tableInstance
            })
        } catch (e) {
            alerts.pushAlert(e + "")
        }
        tableInstance.isLoading = false;
    }

</script>

<div class="actions">
    <Button variant="btn-outline" onClick={handleInsert}>Dodaj</Button>
    <Button variant="btn-outline" onClick={handleUpdate}>Edytuj</Button>
    <Button variant="btn-outline" onClick={handleDelete}>Usuń</Button>
</div>


<style>
    .actions {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1em;
    }
</style>