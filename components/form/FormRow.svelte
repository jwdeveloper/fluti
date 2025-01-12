<script lang="ts">
    interface FormRowProps {
        gap?: string
        sm: string,
        md: string,
        lg: string,
    }
</script>


<div class="container">
    <slot/>
</div>


<style>
    .container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 1em;

        @media (max-width: 1024px) {
            grid-template-columns: 1fr 1fr 1fr;

        }

        @media (max-width: 728px) {
            grid-template-columns: 1fr 1fr;
        }
    }
</style>