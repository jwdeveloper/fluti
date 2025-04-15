<script lang="ts">

    import type {Direction} from "$lib/fluti/flutiSvelteTypes";

    interface LeftRightInteractionsProps {
        swipeThreshold?: number
        onInteraction: (direction: Direction) => void
    }

    let {
        swipeThreshold = 50, onInteraction = (e) => {
        }
    }: LeftRightInteractionsProps = $props();

    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(event: TouchEvent) {
        touchStartX = event.touches[0].clientX;
    }

    function handleTouchEnd(event: TouchEvent) {
        touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX < 0) {
                onInteraction('right')
            } else {
                onInteraction('left')
            }
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'ArrowRight') {
            onInteraction('right')
        }
        if (event.key === 'ArrowLeft') {
            onInteraction('left')
        }
    }
</script>


<svelte:body
        ontouchstart={handleTouchStart}
        ontouchend={handleTouchEnd}
        onkeydown={handleKeyDown}/>

