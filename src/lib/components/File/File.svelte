<script lang="ts">
    import { onMount } from "svelte";

    export let id: string;
    export let name: string;
    export let type: string;
    export let size: number;
    
    let fileUrl: string; 

    onMount(() => fileUrl = window.location.href.split("?")[0] + "/" + name);

    function handleDownload(e: Event) {
        e.stopPropagation();
        downloadFile(id);
    }

    async function downloadFile(fileId: string) {
        const res = await fetch("/download?fileId="+fileId);
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name+"."+type);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
</script>

<div class="border rounded-md shadow-md mb-5">
    <div class="grid md:grid-cols-4 grid-cols-2 gap-x-5 gap-y-1">
        {#if type === "dir"}
            <div class="col-span-2 flex flex-col justify-center p-3">
                <p>{name}</p>
            </div>
            <div class="flex flex-col justify-center p-3">
                <a href={fileUrl} class="button bg-black text-white rounded-md py-1 px-2 text-center">Открыть</a>
            </div>
            <div class="flex flex-col justify-center p-3">
                <form action="?/delete" method="POST" class="text-center">
                    <input type="hidden" name="id" value={id}>
                    <button type="submit" class="button bg-black text-white rounded-md py-1 px-2 text-center w-full">Удалить</button>
                </form>
            </div>
        {:else}
            <div class="flex flex-col justify-center p-3">
                <p>{name}.{type}</p>
            </div>
            <div class="flex flex-col justify-center p-3">
                <p>{size} bytes</p>
            </div>
            <div class="flex flex-col justify-center p-3">
                <form class="text-center">
                    <button on:click={handleDownload} class="button bg-black text-white rounded-md py-1 px-2 text-center w-full">Скачать</button>
                </form>
            </div>
            <div class="flex flex-col justify-center p-3">
                <form action="?/delete" method="POST" class="text-center">
                    <input type="hidden" name="id" value={id}>
                    <button type="submit" class="button bg-black text-white rounded-md py-1 px-2 text-center w-full">Удалить</button>
                </form>
            </div>
        {/if}
    </div>
</div>

<style>
    /* * {
        border: solid green
    } */
</style>