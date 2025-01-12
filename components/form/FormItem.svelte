<script lang="ts">
    import Label from "$lib/fluti/components/label/Label.svelte";
    import {ComponentType, type FormItemProps} from "./Form.types";
    import type {Component} from "svelte";
    import Input from "$lib/fluti/components/input/Input.svelte";
    import InputRange from "../../routes/offers/search/RangeWrapper.svelte";

    let props: FormItemProps = $props();
    let component: Component | undefined = props.component;
    let type = props.type;

    if (!type)
        type = ComponentType.input;

    if (!component) {
        if (type === ComponentType.input)
            component = Input

        if (type === ComponentType.range)
            component = InputRange
    }

</script>

<Label title={props.label ?? '' }
       info={props.info ?? '' }
       error={props.error ?? '' }>
    <svelte:component {...props.data} this={component}/>
</Label>