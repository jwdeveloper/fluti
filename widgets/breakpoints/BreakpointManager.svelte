<script lang="ts">

    import {onMount} from "svelte";

    function updateBreakpoint() {
        //TODO REMOVE
    }

    onMount(() => {
        updateBreakpoint()
    })
</script>

<svelte:head>
    <!--    <script>-->
    <!--        const width = window.innerWidth;-->
    <!--        if (width < 640) controller.breakpoint = 'sm';-->
    <!--        else if (width < 768) controller.breakpoint = 'md';-->
    <!--        else if (width < 1024) controller.breakpoint = 'lg';-->
    <!--        else controller.breakpoint = 'xl';-->
    <!--    </script>-->
</svelte:head>


<svelte:window onresize={updateBreakpoint}></svelte:window>
