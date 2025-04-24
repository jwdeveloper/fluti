<script lang="ts">
    import Space from "$lib/fluti/components/space/Space.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import type {TextAndImageSectionItemProps} from "$lib/fluti/sections/textAndImageSection/types";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import TitleAndTextElement from "$lib/fluti/sections/common/TitleAndTextElement.svelte";

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

            <TitleAndTextElement {...item}/>
    </Element>
</Element>
