<script lang="ts">


    import Form from "$lib/fluti/components/form/Form.svelte";
    import Label from "$lib/fluti/components/label/Label.svelte";
    import Input from "$lib/fluti/components/input/Input.svelte";
    import {WindowCloseReason} from "$lib/fluti/widgets/window/WindowManagerImpl.svelte";
    import Button from "$lib/fluti/components/button/Button.svelte";
    import type {FlutiFormProps} from "./ComponentTypes";
    import {addArrowController} from "$lib/fluti/effects/ArrowController";
    import {onMount} from "svelte";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";

    let {item, window, table, isEdit}: FlutiFormProps = $props();

    let formColumns = $derived.by(() => table.columns.filter(column => column.form !== false));
    let itemState = $state(item)

    let handleFormSubmit = async () => {
        table.isLoading = true;
        window.allowCloseOutsite = false;
        let result = {}

        let formInput = {...itemState};
        delete formInput.formData;
        console.log(formInput)
        if (isEdit) {
            result = await table.updateAsync(formInput);
        } else {
            result = await table.insertAsync(formInput);
        }

        if (result.error) {
            table.isLoading = false;
            window.allowCloseOutsite = true;
            return;
        }
        window.output = result.data;
        window.allowCloseOutsite = true;
        window.close(WindowCloseReason.save);
    }

    let handleInputValueChange = (key, event) => {
        itemState[key] = event.target.value;
    }

    onMount(() => {
        if (isEdit)
            return;

        for (let column of formColumns) {
            itemState[column.key] = '';
        }
    })
</script>


<div use:addArrowController={{target:'input'}}>
    <Form onSubmit={handleFormSubmit}>
        <Panel display="grid"
               rows="auto 1fr"
               height="500px"
               width="500px"
               padding="0"
               justify="">
            <Panel direction="row"
                   justify="space-between"
                   padding="0"
                   width="100%">
                <h1>
                    {!isEdit ? "Utworz" : "Edytuj"}
                </h1>
                <Button
                        size="btn-small"
                        onClick={()=> window.close(WindowCloseReason.cancel)}
                        icon="fa fa-x">
                </Button>
            </Panel>
            <Panel display="grid"
                   columns="repeat(auto-fit, minmax(200px, 1fr))"
                   className="input-panel">
                {#each formColumns as column (column.key)}
                    <Label title={column.text}>
                        <Input disabled={table.isLoading}
                               placeholder='wpisz wartość...'
                               onValueChanged={(e)=>handleInputValueChange(column.key, e)}
                               value={itemState[column.key]}/>
                    </Label>
                {/each}
            </Panel>

            <Panel justify="flex-end">
                <Button type="submit"
                        isLoading={table.isLoading}
                        icon="fa fa-save"
                        variant="btn-filled">
                    Zapisz
                </Button>
                <Button
                        disabled={table.isLoading}
                        icon="fa fa-x"
                        onClick={()=> window.close(WindowCloseReason.cancel)}
                        variant="btn-outline">
                    Anuluj
                </Button>
            </Panel>
        </Panel>
    </Form>
</div>


<style>


    :global(.input-panel) {
        align-self: flex-start;
        overflow-y: auto !important;
        max-height: 100% !important;
        scrollbar-width: thin !important;
        justify-content: flex-start !important;
    }

    h1 {
        font-size: 2em;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: var(--bg-accent);
        font-weight: bold;
    }
</style>