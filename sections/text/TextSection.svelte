<script lang="ts">
    import SectionContainer from "$lib/fluti/sections/SectionContainer.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
</script>


<Element
        padding="10% 15%"
        background={flutiTheme.background.accent}>


    <Element
            direction="column"
            width="100%"
    >

        <h2 style="font-size: 3rem; color: {flutiTheme.color.accent} !important;">Zacznij korzystaj z ESCOOL już dziś</h2>
        <Element padding="0 15%" style="text-align: center">

            <h3 style="font-weight: normal;">Create a free account so you can save your progress any time and access thousands of math resources for
                you
                to customize and share with others</h3>
        </Element>

        <Button2 background={flutiTheme.background.primary}>Utwórz konto</Button2>
    </Element>

</Element>