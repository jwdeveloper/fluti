<script lang="ts">

    import Skieleton from "$lib/fluti/components/skieleton/Skieleton.svelte";
    import Section from "$lib/fluti/pages/theme/common/Section.svelte";
</script>

<Section title="Shapes">

    <Skieleton condition={false} height="200px" width="500px">

    </Skieleton>

    <Skieleton condition={false} height="200px" width="200px">

    </Skieleton>
</Section>

<Section title="Nested">

    <Skieleton showChildren={true} condition={false} height="100px" width="300px">
        <Skieleton reversed={true} condition={false} height="50px" width="50px">
            siemA
        </Skieleton>

        <Skieleton reversed={true} condition={false} height="50px" width="50px">
            siemB
        </Skieleton>

        <Skieleton reversed={true} condition={false} height="50px" width="50px">
            siemC
        </Skieleton>
    </Skieleton>
</Section>
