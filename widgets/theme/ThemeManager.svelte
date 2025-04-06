<script lang="ts">
    import {useThemes} from "$lib/fluti/widgets/theme/themeController.svelte";
    import {onMount} from "svelte";

    const themes = useThemes();

    onMount(() => {
        themes.load();
    })
</script>


