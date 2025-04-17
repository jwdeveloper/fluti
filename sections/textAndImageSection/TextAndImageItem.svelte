<script lang="ts">
    import Space from "$lib/fluti/components/space/Space.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {ElementProps} from "$lib/fluti/components/panel/ElementProps";

    let {
        key = '',
        subTitleColor = '',
        item,
        ...props
    }: ElementProps = $props();

</script>

<Element height="60vh"
         mobile={{height:'auto'}}
         id={key}
         className="text-item"
         align="flex-start">
    <Element

            height="auto" direction="column"
            align="flex-start"
            {...props}
    >
        <h3 style="color: {subTitleColor}">{item.subTitle}</h3>
        <h2>{item.title}</h2>
        <Space/>
        <h3 style="font-weight: normal">
            {item.text}
        </h3>
    </Element>
</Element>

<style>

    h3 {
        font-weight: 500;
    }

    h2 {
        font-weight: 500;
        font-size: 2.5em;
    }

</style>