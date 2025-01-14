<script lang="ts">

    let {
        height = "8px",
        radius = "4px",
        maxValue = 100,
        currentValue = 50,
    } = $props();


    let getWidth = $derived.by(() => {
        return (currentValue / maxValue * 100);
    })
</script>


<div class="progress-bar"
     style="border-radius:{radius};">
    <div class="progress" style="
     border-radius:{radius};
     width: {getWidth}%;
     height:{height}; ">

    </div>
    <slot/>
</div>


<style>
    .progress-bar {
        position: relative;
        width: 100%;
        background: var(--bg-tertiary);
        border-radius: 4px;
    }

    .progress-bar .progress {
        height: 8px;
        background: var(--accent-primary);
        border-radius: 4px;
    }


    .progress
    {
        position: relative;
    }

    .progress-child
    {
        position: absolute;
        top: 25%;
        left: 5%;
        width: 90%;
        height: 10%;
        background: rgba(255, 255, 255, 0.22);
        border-radius: 2em;
    }

</style>