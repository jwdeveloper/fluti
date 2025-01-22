<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import Icon from "$lib/fluti/components/icon/Icon.svelte";
    import Title from "$lib/fluti/components/title/Title.svelte";
    import Label from "$lib/fluti/components/label/Label.svelte";


    let {
        data = undefined,
        onClick,
        icon = '',
        name = '',
        color = undefined,
        fontSize='',
        children = undefined,
    } = $props();

    let handleClick = (e) => {
        if (onClick)
            onClick(e);
    }
    let isMouseOver = $state(false)


    let borderColor = $derived.by(() => {

        let defaultColor = color ?? 'var(--accent-primary)';
        if (data === '' && isMouseOver)
            return 'var(--text-primary)'

        return data !== '' ? defaultColor : 'var(--text-muted)'
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
                font-size: {fontSize};
                        background: var(--bg-secondary);
                        border: var(--border-size) solid {borderColor} !important;
                        color:var(--text-light);
                       "
                onClick={handleClick}
                icon='fa {icon}'>
        </Icon>
    </Panel>
    {@const isData = data !== ''}
    {#if isData}
        <Panel direction="column" gap="0"
               justify="flex-start"
               style="z-index: var(--z-index-3)"
               width="100%"
               align="flex-start">
            <Title tag="h4"
                   lineHeight="1"
                   color="light">
                {name}
            </Title>
            <Title tag="h4"
                   weight="500"
                   color="primary">
                {data}

            </Title>
                {#if children}
                    {@render children()}
                {/if}
        </Panel>

    {:else}
        <Title
                tag="h4"
                weight="600"
                style="
            z-index: var(--z-index-3);
            color: {isData?'var(--text-primary)':'var(--text-muted)'};
            width: 100%">
            {name}
        </Title>

    {/if}

</Panel>
