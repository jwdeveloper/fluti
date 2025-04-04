<script>
    import IconCard from "$lib/fluti/widgets/cards/IconCard.svelte";

    let {title, description, icon} = $props();
</script>


<IconCard icon={icon}
          subtitle={description}
          title={title}>
</IconCard>
