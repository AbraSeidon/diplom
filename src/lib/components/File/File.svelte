<script lang="ts">
    import { onMount } from "svelte";
    import { Folder, File, CloudDownload, Trash2, FolderOpen } from "lucide-svelte"

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
            <div class="col-span-2 gap-2 flex items-center p-3">
                <div>
                    <Folder size={36} fill={"#000"} />
                </div>
                <div>
                    <p class="break-all">{name}</p>
                </div>
            </div>
            <div class="flex flex-col justify-center p-3">
                <a href={fileUrl} class="button bg-black text-white rounded-md flex flex-row items-center py-1 px-2 ">
                    <div>
                        <FolderOpen size={24}/>
                    </div>
                    <div class="grow text-center">
                        Открыть
                    </div>
                </a>
            </div>
            <div class="flex flex-col justify-center p-3">
                <form action="?/delete" method="POST" class="text-center">
                    <input type="hidden" name="id" value={id}>
                    <button type="submit" class="button bg-black text-white rounded-md py-1 px-2 flex flex-row items-center w-full">
                        <div>
                            <Trash2 size={24}/>
                        </div>
                        <div class="grow text-center">
                            Удалить
                        </div>
                    </button>
                </form>
            </div>
        {:else}
            <div class="flex gap-2 items-center p-3">
                <div>
                    <File size={36}/>
                </div>
                <div >
                    <p class="break-all">{name}.{type}</p>
                </div>
            </div>
            <div class="flex justify-center items-center p-3">
                <p>{size} bytes</p>
            </div>
            <div class="flex items-center p-3">
                <form class="text-center w-full">
                    <button on:click={handleDownload} class="button bg-black text-white rounded-md flex flex-row items-center py-1 px-2 w-full">
                        <div>
                            <CloudDownload size={24}/>
                        </div>
                        <div class="grow text-center">
                            Скачать
                        </div>
                    </button>
                </form>
            </div>
            <div class="flex items-center p-3">
                <form action="?/delete" method="POST" class="text-center w-full">
                    <input type="hidden" name="id" value={id}>
                    <button type="submit" class="button bg-black text-white rounded-md py-1 px-2 flex flex-row items-center w-full">
                        <div>
                            <Trash2 size={24}/>
                        </div>
                        <div class="grow text-center">
                            Удалить
                        </div>
                    </button>
                </form>
            </div>
        {/if}
    </div>
</div>