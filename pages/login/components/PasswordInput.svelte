<script lang="ts">
    import type {InputProps2, InputType} from "../../../../../routes/project/components/input/Input.type";
    import Input2 from "$lib/fluti/components/input/Input2.svelte";

    let {value = $bindable(), ...props}: InputProps2 = $props()

    let isPasswordShown = $state(false)
    let passwordType: InputType = $derived.by(() => {
        return isPasswordShown ? 'text' : 'password'
    })
    let passwordIcon = $derived.by(() => {
        return !isPasswordShown ? 'fa fa-eye' : 'fa fa-eye-slash'
    })


</script>


<Input2
        bind:value={value}
        onIconClick={()=>{ isPasswordShown = !isPasswordShown}}
        type={passwordType}
        icon={passwordIcon}
        {...props}
/>

<style lang="ts">



</style>