<script lang="ts">
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import TitleAndTextElement from "$lib/fluti/sections/common/TitleAndTextElement.svelte";
    import Space from "$lib/fluti/components/space/Space.svelte";
    import {breakpoints} from "$lib/fluti/widgets/breakpoints/breakpointsImpl.svelte";

</script>


<Element
        padding="5% 15%"
        margin={breakpoints.isMobile?"20% 0":""}
        background={flutiTheme.background.accent}>


    <Element
            direction="column"
            align="flex-start"
            display="grid"
            columns="1fr 1fr"
            width="100%"
    >

        <Element direction="column" align="flex-start">

            <TitleAndTextElement title="Zaanagarzuj się"
                                 color={flutiTheme.color.accent}
                                 textColor={flutiTheme.color.accent}
                                 subTitle="Nauczyciele"
                                 textWidth="80%"
                                 text="Pomagaj uczniom w nauce dowolnego materiału. Bezpłatne zestawy fiszek, rozmaite tryby nauki i gry w klasie, takie jak Quizlet Live, pozwolą Ci błyskawicznie zmobilizować klasę do działania."
            >

            </TitleAndTextElement>
            <Space/>
            <Button2 padding="1.2em 3em"
                     style="font-weight: bold"
                     variant="text"
                     effects={{click:{}}}
                     background={flutiTheme.background.primary}>Utwórz konto za darmo
            </Button2>
        </Element>

        {#if !breakpoints.isMobile}
            <Element height="100%">
                <Element
                        tag="img"
                        radius="1em"
                        attributes={{src:"screenshots/learn-pc.png"}}>
                </Element>
            </Element>
        {/if}
    </Element>

</Element>