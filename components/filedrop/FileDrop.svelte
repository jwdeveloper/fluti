<script lang="ts">
    import ListGroup from "$lib/fluti/components/list/ListGroup.svelte";
    import Element from "$lib/fluti/components/panel/Element.svelte";
    import {useAlert} from "$lib/fluti/widgets/alert/AlertImpl.svelte";


    interface FileDropProps {
        maxSize?: number
        files: any[]
        maxFiles?: number
        placeholder?: string
    }

    let {
        placeholder = "Drag and drop files here, or click to upload",
        dropTemplate = undefined,
        onDrop = undefined,
        files = $bindable([]),
        maxSize = 100,
        maxFiles = 100,
        messages = {
            fileName: 'File too big',
            tooManyFiles: 'Too many files, limit is',

        }
    }: FileDropProps = $props();


    let fileSelectElement: HTMLHtmlElement;

    const handleFiles = (newFiles: FileList) => {
        let array = Array.from(newFiles);
        for (let file of array) {
            if (files.find((f: File) => f.name === file.name))
                continue;

            if (file.size > maxSize * 1024 * 1024) {
                useAlert().pushAlert(messages.fileName)
                continue;
            }

            if (files.length + 1 > maxFiles) {
                useAlert().pushAlert(messages.tooManyFiles + " " + maxFiles)
                continue
            }

            files.push(file);
        }

        if (onDrop) {
            onDrop(files);
        }
    };


    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer?.files) {
            handleFiles(event.dataTransfer.files);
        }
    };

    const preventDefaults = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDelete = (item: any) => {
        files = files.filter((file: File) => file.name !== item.name)
        console.log(files)
    }

    const handleInsert = (item: any) => {
        fileSelectElement.click();
    }
</script>

<div
        class="drop-area"
        ondrop={handleDrop}
        ondragover={preventDefaults}
        ondragenter={preventDefaults}
        ondragleave={preventDefaults}>

    {#if files.length === 0}
        <Element direction="column"
                 width="100%" height="100%">
            <i class="fa fa-file-upload"></i>
            <h5 style="font-weight: normal">{placeholder}</h5>
        </Element>

    {/if}
    <input type="file"
           multiple
           bind:this={fileSelectElement}
           onchange={(e: Event) =>{
               const target = e.target;
        if (target?.files) {
            handleFiles(target.files);
            target.value = '';
        }
           } }/>


    {#if files.length > 0}
        {#if dropTemplate}
            <svelte:component this={dropTemplate}
                              handleDelete={handleDelete}
                              items={files}></svelte:component>
        {:else}
            <Element padding="0" justify="space-between"
                     direction="row" width="100%">

                <ListGroup isOpen={true}
                           enableDelete={true}
                           onDelete={handleDelete}
                           onInsert={handleInsert}
                           useInsertTemplate={false}
                           allowInsert={true}
                           items={files}/>

            </Element>
        {/if}

    {/if}
</div>


<style>

    :global(.file-template) {
        i {
            font-size: 1em !important;
        }
    }

    .drop-area {
        border: var(--border-size-large) dashed var(--bg-tertiary);
        padding: 1em 1em;
        text-align: center;
        justify-content: center;
        align-items: center;
        border-radius: 0.8em;
        position: relative;
        width: 100%;
        max-height: 300px;
        overflow: scroll;
        height: auto;

        i {
            font-size: 4em;
            color: var(--bg-accent);
        }

        p {
            color: var(--color-darker);
        }
    }

    .drop-area:hover {
        cursor: pointer;
        border-color: var(--text-muted);
        color: var(--text-light);
    }

    .drop-area input[type="file"] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 1em 0 0;
    }

    li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5em;
        background: var(--bg-100);
        border: var(--border-size-medium) solid var(--color-lighter);
        margin-bottom: 0.5em;
        border-radius: 4px;
    }

    .file-icon {
        margin-right: 0.5em;
        color: var(--primary);
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--danger);
        font-size: 1.2em;
    }

    button:hover {
        color: var(--danger-dark);
    }
</style>
