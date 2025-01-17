<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Title from "$lib/fluti/components/title/Title.svelte";
    import Label from "$lib/fluti/components/label/Label.svelte";


    let {
        data = undefined,
        onClick,
        icon = '',
        name = ''
    } = $props();

    let handleClick = (e) => {
        if (onClick)
            onClick(e);
    }
    let isMouseOver = $state(false)


    let borderColor = $derived.by(() => {


        if (data === '' && isMouseOver)
            return 'var(--text-primary)'

        return data !== '' ? 'var(--accent-primary)' : 'var(--text-muted)'
    })

    let mouseOver = (s) => {
        isMouseOver = s;
    };

</script>


<Panel width="100%"
       ripplerEffect={true}
       align="flex-start"
       style="z-index: var(--z-index-2)"
       radius="1em"
       onClick={handleClick}
       onMouseOver={mouseOver}
       justify="flex-start">
    <Panel style="z-index: var(--z-index-3)">
        <Icon
                style="
                        font-size: 1.5em;
                        background: var(--bg-secondary);
                        border: var(--border-size) solid {borderColor} !important;
                        color:var(--text-light);
                       "
                onClick={handleClick}
                icon={icon}>
        </Icon>
    </Panel>
    {@const isData = data !== ''}

    <Title style="
            font-weight: 500;
            font-size: 1.2em;
            z-index: var(--z-index-3);
            color: {isData?'var(--text-primary)':'var(--text-muted)'};
             width: 100%">
        {#if isData}
            <Label gap="1px" style="padding:0;"
                   labelColor="var(--text-light)"
                   title={name}>
                <div style="font-size: 1.2em">
                    {data}
                </div>
            </Label>
        {:else}
            {name}
        {/if}
    </Title>

</Panel>
