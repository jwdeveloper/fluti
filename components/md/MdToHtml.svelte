<script lang="ts">
    import snarkdown from "snarkdown";
    import Element from "$lib/fluti/components/panel/Element.svelte";

    const {children} = $props()
    const isBrowser = typeof window !== 'undefined';
    let htmlContent = $state('');

    if (!isBrowser && children) {
        let elementOutput = {
            out: ''
        }
        children(elementOutput)
        let content = elementOutput.out;
        content = content
            .replaceAll("<!---->", "")
            .split('\n')
            .map(line => line.trimStart())
            .join('\n');
        htmlContent = snarkdown(content);
    }

</script>


<Element width="100%"
         className="article-content"
         display="block"
         height="100%">
    {@html htmlContent}
</Element>


<style>

    :global(.article-content) {
        line-height: 1.6;
        font-size: 1.2rem;
        width: 100%;

        :global(h1) {
            font-size: clamp(3rem, 5vw, 2.5rem);
            font-weight: 600;
            margin: 1.5em 0 0.6em;
        }

        :global(h2) {
            font-size: clamp(1.75rem, 4.5vw, 2rem);
            font-weight: 600;
            margin: 1.4em 0 0.6em;
        }

        :global(h3) {
            font-size: clamp(1.5rem, 4vw, 1.75rem);
            font-weight: 500;
            margin: 1.3em 0 0.5em;
        }

        :global(h4) {
            font-size: clamp(1.25rem, 3.5vw, 1.5rem);
            font-weight: 500;
            margin: 1.2em 0 0.4em;
        }

        :global(h5) {
            font-size: clamp(1.1rem, 3vw, 1.25rem);
            font-weight: 500;
            margin: 1.2em 0 0.4em;
        }

        :global(h6) {
            font-size: clamp(1rem, 2.8vw, 1rem);
            font-weight: 500;
            margin: 1em 0 0.3em;
        }

        :global(p),
        :global(span) {
            font-size: clamp(1rem, 2.5vw, 1.1rem);
            margin: 0.75em 0;
        }

        :global(a) {
            color: cornflowerblue;
            text-decoration: underline;
            word-break: break-word;

        }

        :global(ul),
        :global(ol) {
            /*padding-left: 1.5rem;*/
            font-weight: 500;
            margin: 1em 0;
        }

        :global(li) {
            margin-bottom: 0.5em;
        }

        :global(blockquote) {
            font-style: italic;
            padding-left: 1rem;
            border-left: 0.5em solid var(--shadow);
            font-weight: normal;
            color: var(--text-muted);
            margin: 1em 0;
        }

        :global(code) {
            background: var(--bg-tertiary);
            color: var(--text-light);
            padding: 0.3em 0.8em;
            border-radius: 6px;
            font-size: 0.95rem;
        }

        :global(pre) {
            width: 100%;
            padding: 1em;
            margin: 2em 0;
            background: var(--bg-tertiary);
            color: var(--text-light);
            overflow-x: auto;
            font-size: 0.9rem;
            border-radius: 6px;
        }
    }
</style>