<script lang="ts">
    import Input2 from "../../../../../components/input/Input2.svelte";
    import type {InputProps2, InputType} from "../../../../../components/input/Input.type";

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