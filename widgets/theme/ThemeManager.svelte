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
        let themeValueHolder = localStorage.getItem("theme");
        if (themeValueHolder === undefined)
            themeValueHolder = "dark";
        document.documentElement.setAttribute("data-theme", themeValueHolder);
    </script>
</svelte:head>
