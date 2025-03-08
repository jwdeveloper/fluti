<script lang="ts">

    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {onMount} from "svelte";

    interface TyperProps {
        prefix: string
        options: string[]
        delay: number
        letterDelay: number
        input: string
        tag: string
    }

    let {prefix = "", options = [], tag = "span", delay = 2000, letterDelay = 100}: TyperProps = $props();

    let index = 0; // Current word index
    let charIndex = 0; // Character index
    let currentText = $state(prefix); // Displayed text
    let isDeleting = false; // Whether we're deleting

    function typeEffect() {
        let word = options[index];

        if (!isDeleting) {
            // Typing effect
            currentText = prefix + word.slice(0, charIndex + 1);
            charIndex++;

            if (charIndex === word.length) {
                isDeleting = true;
                setTimeout(typeEffect, delay); // Wait before deleting
                return;
            }
        } else {
            // Deleting effect
            currentText = prefix + word.slice(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % options.length; // Move to the next word
            }
        }

        setTimeout(typeEffect, letterDelay);
    }

    onMount(() => {
        typeEffect();
    });
</script>


<Element>

    <svelte:element this={tag}>
        {currentText}
    </svelte:element>
</Element>

