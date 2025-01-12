<script lang="ts">

    import type {FormProps} from "./Form.types";
    import {addArrowController} from "../../effects/ArrowController";

    let {
        onSubmit = async () => {
        },
        formData = {},
        isSubmitting = $bindable(false)
    }: FormProps = $props();


    async function handleSubmit(event: Event) {
        event.preventDefault();
        isSubmitting = true
        await onSubmit(formData);
        isSubmitting = false
    }
</script>

<form use:addArrowController onsubmit={handleSubmit} class="form-container">
    <slot/>
</form>

<style>
    .form-container {
        width: 100%;
        height: 100%;
    }

    /*button {*/
    /*    padding: 8px 16px;*/
    /*    cursor: pointer;*/
    /*    border: none;*/
    /*    background-color: #007bff;*/
    /*    color: white;*/
    /*    border-radius: 4px;*/
    /*    transition: background-color 0.3s;*/
    /*}*/

    /*button:disabled {*/
    /*    background-color: #ccc;*/
    /*    cursor: not-allowed;*/
    /*}*/

    /*button:hover:not(:disabled) {*/
    /*    background-color: #0056b3;*/
    /*}*/
</style>
