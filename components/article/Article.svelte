<script lang="ts">

    import type {ArticleProps} from "./Article.types.ts";

    let {rows = 'auto 1fr', content = '', columns = '1fr', padding='1em', style=''}: ArticleProps = $props()

</script>


<Panel panelType="grid"
       rows={rows}
       columns={columns}
       gap="0"
       background="var(--bg-page)"
       padding={padding}
       height="100%"
       align="space-between"
       maxHeight="100vh"
       overflow="hidden"
       style={style}
       width="100%">
    <slot/>
</Panel>

