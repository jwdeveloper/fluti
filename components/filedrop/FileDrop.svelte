<script lang="ts">
    import Panel from "$lib/fluti/components/panel/Panel.svelte";
    import ListGroup from "$lib/fluti/components/list/ListGroup.svelte";


    let {
        placeholder = "Drag and drop files here, or click to upload",
        dropTemplate=undefined,
        onDrop = undefined,
        files = $bindable([])
    } = $props();


    let fileSelectElement: HTMLHtmlElement;

    const handleFiles = (newFiles: FileList) => {
        let array = Array.from(newFiles);
        for (let file of array) {
            if (files.find((f: File) => f.name === file.name))
                continue

            files.push(file)
        }

        if(onDrop) {
            onDrop(files)
        }
    };

    const removeFile = (fileToRemove: File) => {
        let index = files.indexOf(fileToRemove)
        files.splice(index, 1);
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
        <Panel direction="column" width="100%" height="100%">
            <i class="fa fa-file-upload"></i>
            <p>{placeholder}</p>
        </Panel>
    {/if}

    <input type="file"
           multiple
           bind:this={fileSelectElement}
           onchange={(e: Event) => handleFiles((e.target?.files))}/>


    {#if files.length > 0}


        {#if dropTemplate}
            {@render dropTemplate()}
        {:else}
        <Panel padding="0" style="max-width: 200px" justify="space-between"
               direction="row" width="100%">
            <ListGroup isOpen={true}
                       enableDelete={true}
                       onDelete={handleDelete}
                       onInsert={handleInsert}
                       useInsertTemplate={false}
                       allowInsert={true}
                       items={files}/>
        </Panel>
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
        border: 2px dashed var(--color-ligher);
        padding: 1em 1em;
        text-align: center;
        justify-content: center;
        align-items: center;
        border-radius: 0.8em;
        position: relative;
        width: 100%;
        height: 100%;

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
        border: 2px dotted var(--color-darker);

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
        border: 1px solid var(--color-lighter);
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
