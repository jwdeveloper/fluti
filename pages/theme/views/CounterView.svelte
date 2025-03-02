<script lang="ts">
    import Counter from "$lib/fluti/components/counter/Counter.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import Button2 from "$lib/fluti/components/button/Button2.svelte";
    import CounterDigit from "$lib/fluti/components/counter/CounterDigit.svelte";
    import Section from "$lib/fluti/pages/theme/common/Section.svelte";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

    let counter = $state(0);

    let displayedValue = $derived.by(() => {
        return counter + "%"
    })
</script>


<Element>
    <Button2 variant="filled" onClick={()=> counter +=1234}>Increase by +1000</Button2>
    <Button2 variant="filled" onClick={()=> counter -=1234}>Decrease by -1000</Button2>
</Element>

<Section title="font size">
    <Element width="100%" align="flex-start" direction="column">
        <Counter value={displayedValue}/>
        <Counter fontSize={60} value={displayedValue}/>
        <Counter fontSize={90} value={displayedValue}/>
        <Counter fontSize={120} value={displayedValue}/>
    </Element>
</Section>


<Section title="font weight">
    <Element direction="column">
        <Counter fontWeight={200} value={displayedValue}/>
        <Counter fontWeight={400} value={displayedValue}/>
        <Counter fontWeight={600} value={displayedValue}/>
        <Counter fontWeight={800} value={displayedValue}/>
    </Element>
</Section>


<Section title="font color">
    <Element direction="column">
        <Counter fontColor={flutiTheme.color.primary} value={displayedValue}/>
        <Counter fontColor={flutiTheme.background.accent} value={displayedValue}/>
        <Counter fontColor={flutiTheme.color.light} value={displayedValue}/>
        <Counter fontColor={flutiTheme.color.error} value={displayedValue}/>
        <Counter fontColor={flutiTheme.color.muted} value={displayedValue}/>
        <Counter fontColor={flutiTheme.color.neutral} value={displayedValue}/>
    </Element>
</Section>
