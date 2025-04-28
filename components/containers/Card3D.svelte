<script lang="ts">

    import {Card3DController} from "$lib/fluti/components/containers/Card3DController.svelte";
    import {onMount} from "svelte";

    let {children, isHover = false} = $props();

    let isMouseEntered = $state(false);

    let element: HTMLDivElement;

    const handleMouseMove = (e: MouseEvent) => {

        if (!element) return;
        const {left, top, width, height} = element.getBoundingClientRect();
        const x = (e.clientX - left - width / 2) / 25;
        const y = (e.clientY - top - height / 2) / 25;
        element.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    };

    const handleMouseEnter = (e: MouseEvent) => {
        isMouseEntered = true;
        if (!element) return;
    };

    const handleMouseLeave = (e: MouseEvent) => {
        if (!element) return;
        isMouseEntered = false;
        element.style.transform = `rotateY(0deg) rotateX(0deg)`;
    };
    onMount(() => {
        // let controller = new Card3DController(element);
        element = undefined;
        return () => {
            // controller.destory();
        }
    })

</script>


<div
        onmouseenter={handleMouseEnter}
        onmousemove={handleMouseMove}
        onmouseleave={handleMouseLeave}
        bind:this={element} class="card-3d-style " class:card-hovered={isHover}>
    {@render children?.()}
</div>


<style>
    .card-3d-style:hover {

        transition: all 200ms ease-in-out;
        scale: 1.1;
    }

    @keyframes flyDownAndRotate {
        0% {
            transform: rotateX(-175deg) rotateY(180deg) rotateZ(185deg) translateY(-200px);
        }
        50% {
            transform: translateY(10px);

        }
        100% {
            transform: rotateX(-175deg) rotateY(180deg) rotateZ(185deg) translateY(0px);
            scale: 0.95;
            opacity: 1;
        }
    }

    .card-3d-style {
        /*transform: rotateX(-180deg) rotateY(180deg) rotateZ(180deg);*/
        /*animation: flyDownAndRotate 1.2s ease-in forwards;*/
        z-index: 1 !important;
        padding: 0;
        width: 400px;
        height: 700px;
        /*transition: all 200ms ease-in-out;*/

        perspective: 1000px;
        transform: perspective(1000px) rotateX(8deg) rotateY(-3deg) rotateZ(4deg) scale(0.9);
        filter: blur(0.05em);
        /*opacity: 0.5;*/
        transition: 0.6s ease-in-out all;

        &:hover {
            transform: perspective(3000px) rotateX(4deg) rotateY(-0deg) rotateZ(0deg) scale(0.95);

            filter: blur(0);
            opacity: 1;
            /*box-shadow: 0 0 2em 0.1em rgba(0, 0, 0, 0.5);*/

        }

    }

    .card-hovered {
        transform: perspective(800px) rotateY(-15deg) translateY(-50px) rotateX(10deg) scale(1);
        filter: blur(0);
        opacity: 1;
        box-shadow: 0 0 2em 0.1em rgba(0, 0, 0, 0.5);
    }
</style>