<script lang="ts">

    import {Card3DController} from "$lib/fluti/components/containers/Card3DController.svelte";
    import {onMount} from "svelte";

    let {children, isHover = false} = $props();
    let element: HTMLDivElement;

    onMount(() => {
        let controller = new Card3DController(element);
        return () => {
            controller.destory();
        }
    })

</script>


<div bind:this={element} class="card-3d-style " class:card-hovered={isHover}>
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

        transform: perspective(1000px) rotateY(25deg) scale(0.9) rotateX(10deg);
        filter: blur(2px);
        /*opacity: 0.5;*/
        transition: 0.6s ease all;

        &:hover {
            transform: perspective(800px) rotateY(-15deg) translateY(-50px) rotateX(10deg) scale(1);
            filter: blur(0);
            opacity: 1;
        box-shadow: 0 0 2em 0.1em rgba(0, 0, 0, 0.5);

        }
    }

    .card-hovered {
        transform: perspective(800px) rotateY(-15deg) translateY(-50px) rotateX(10deg) scale(1);
        filter: blur(0);
        opacity: 1;
        box-shadow: 0 0 2em 0.1em rgba(0, 0, 0, 0.5);
    }
</style>