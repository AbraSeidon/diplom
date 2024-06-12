<script lang="ts">
    import { onMount } from "svelte";
    import { Folder, File, CloudDownload, Trash2, FolderOpen } from "lucide-svelte"
    import { goto } from "$app/navigation";

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

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="border rounded-md shadow-md h-full cursor-pointer" on:click|stopPropagation={ type === "dir" ? () => goto(fileUrl) : handleDownload} style="aspect-ratio: 1 / 1">
    <div class="flex flex-col items-center p-3 w-32">
        {#if type === "dir"}
            <div>
                <Folder size={100} fill={"#000"} />
            </div>
            <div>
                <p class="break-all h-12">{name.length < 10 ? name : name.substring(0, 20)+"..."}</p>
            </div>
            <div class="pt-2">
                <form action="?/delete" method="POST" class="text-center">
                    <input type="hidden" name="id" value={id}>
                    <button on:click|stopPropagation type="submit" class="button bg-black text-white rounded-md py-1 px-2 flex flex-row items-center w-full">
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
            <div>
                <File size={100}/>
            </div>
            <div >
                <p class="break-all h-12">{(name+"."+type).length < 20 ? name+"."+type : name.substring(0, 20-type.length-3)+"..."+type}</p>
            </div>
            <div class="flex items-center pt-2">
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