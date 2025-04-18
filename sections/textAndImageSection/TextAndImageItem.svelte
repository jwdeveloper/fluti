<script lang="ts">
    import Space from "$lib/fluti/components/space/Space.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {TextAndImageSectionItemProps} from "$lib/fluti/sections/textAndImageSection/types";

    let {
        key,
        item,
        ...props
    }: TextAndImageSectionItemProps = $props();

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
        <h3 style="color: {item.color}">{item.subTitle}</h3>
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