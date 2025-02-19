<script lang="ts">
    import ButtonsView from "$lib/fluti/pages/theme/views/ButtonsView.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import DefaultMenu from "$lib/fluti/widgets/menu/DefaultMenu.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import HeadersView from "$lib/fluti/pages/theme/views/HeadersView.svelte";
    import ThemeSwitch from "../../../../components/widgets/theme/ThemeSwitch.svelte";
    import InputView from "$lib/fluti/pages/theme/views/InputView.svelte";
    import Title from "$lib/fluti/components/title/Title.svelte";
    import ElementView from "$lib/fluti/pages/theme/views/ElementView.svelte";
    import SkieletonView from "$lib/fluti/pages/theme/views/SkieletonView.svelte";

    let views = [
        {
            name: 'Buttons',
            view: ButtonsView
        },
        {
            name: 'Input',
            view: InputView
        },
        {
            name: 'Topography',
            view: HeadersView
        },
        {
            name: 'Skieleton',
            view: SkieletonView
        },
        {
            name: 'Element',
            view: ElementView
        }
    ]
    let currentView: any = $state(views[3])
</script>

<Element display="grid" columns="200px 1fr"
         height="auto"
         gap="0.1em"
         style="min-height: 100vh"
         mobile={{columns:'1fr'}}
         align="flex-start">


    <Element padding="1em"
             align="center"
             justify="flex-start"
             mobile={{display:'none'}}
             height="100%"
             direction="column"
             background={flutiTheme.background.primary}>
        <ThemeSwitch/>
        <DefaultMenu
                currentItemKey={views[0].name}
                onClick={(item)=> currentView =item}
                highlightColor={flutiTheme.background.secondary}
                direction="column"
                items={views}/>
    </Element>

    <Element
            background={flutiTheme.background.primary}
            padding="1em" height="100%"
            justify="flex-start"
            direction="column" align="flex-start" width="100%">
        <Title>{currentView.name}</Title>
        {@render currentView.view()}
    </Element>

</Element>