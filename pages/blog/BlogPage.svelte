<script lang="ts">
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";
    import type {BlogPageProps} from "./types";
    import Panel from "$lib/fluti/components/containers/Panel.svelte";

    let props: BlogPageProps = $props();
</script>

<svelte:head>
    {@html props.htmlTags}
    {@html props.htmlSchemaBlog}
</svelte:head>

<Panel direction="column"
       tag="article"
       margin="2em 0"
       padding='3em 4em'
       background={flutiTheme.background.primary}
       radius='1em'
       align="flex-start">
    {@html props?.htmlBlogContent}
</Panel>

