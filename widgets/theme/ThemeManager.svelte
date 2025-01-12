<script lang="ts">
    import {useThemes} from "$lib/fluti/widgets/theme/themeController.svelte";
    import {onMount} from "svelte";

    const themes = useThemes();

    onMount(() => {
        themes.load();
    })
</script>


<svelte:head>
    <script>
        let themeValue = localStorage.getItem("theme");
        if (themeValue === undefined)
            themeValue = "dark";
        document.documentElement.setAttribute("data-theme", themeValue);
    </script>
</svelte:head>
