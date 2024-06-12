<script lang="ts">
    import File from '$lib/components/File/File.svelte';
    import { enhance } from '$app/forms';
    import {Search, FolderPlus, Upload, LogOut, ArrowDownAZ, ArrowDownZA, ArrowDown10, ArrowDown01, AlignJustify, LayoutGrid} from "lucide-svelte"
    import FileTile from '$lib/components/FileTile/FileTile.svelte';

    export let data;
    export let form;
    
    let selected = '1';
    let grid = "1";
    let sorted: typeof data.files;
    let searchBarString = "";
    let newDirName: string = "";
    const forbiddenChars: string[] = [".", "/", "\\", "*", "?", "\"", "'", "`", "<", ">", "|", "&"];
    $: list = forbiddenChars.filter(char => newDirName.includes(char) )
    $: isValid = list.length === 0;
    $: isEmpty = newDirName.length === 0;

    $: {
        switch (selected) {
            case "1":
                sorted = data.files.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "2":
                sorted = data.files.sort((a, b) => a.name.localeCompare(b.name)).reverse();
                break;
            case "3":
                sorted = data.files.sort((a, b) => b.size - a.size);
                break;
            case "4":
                sorted = data.files.sort((a, b) => a.size - b.size);
                break;
            default: 
                sorted = data.files.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
       }

    $: searched = sorted.filter((file) => file.name.includes(searchBarString));

    let dialogDirCreate: HTMLDialogElement;

</script>

<div class="flex h-screen">
    <div class="md:flex flex-col px-3 justify-between hidden bg-slate-400 static min-w-60">
        <div>
            <div class="mb-5">
                <button type="button" on:click={()=> dialogDirCreate.showModal()} class="button bg-black text-white text-lg rounded-md py-1 px-2 w-full flex flex-row items-center">
                    <FolderPlus/>
                    <div class="grow text-center">
                        Создать папку
                    </div>
                </button>
            </div>
            <div>
                <form method="POST" action="?/upload" enctype="multipart/form-data" use:enhance>
                    <label for="file">
                        <div class="button bg-black text-white text-lg rounded-md py-1 px-2 w-full flex flex-row  items-center cursor-pointer">
                            <Upload/>
                            <div class="grow text-center">
                                Загрузить файл
                            </div>
                        </div>
                        <input type="file" name="file" id="file" class="hidden" onchange="form.submit()" /> 
                    </label>
                    {#if form}
                        <p class="text-red-600 font-medium text-center pt-2">{form.message}</p>
                    {/if}
                </form>
            </div>
        </div>
        <div>
            <div>
                <p class="font-medium">Использовано места</p>
                <p>{(data.spaceUsed/1024/1024).toFixed(2)} MB из {data.maxSpace/1024/1024} MB</p>
                <progress id="spaceProgress" max={data.maxSpace} value={data.spaceUsed} class="w-full"></progress>
            </div>

            <div class="my-5">
                <form method="POST" action="/logout">
                    <button type="submit" class="button bg-red-600 text-white text-lg rounded-md py-1 px-2 flex flex-row items-center w-full">
                        <LogOut />
                        <div class="grow">
                            Выйти
                        </div>
                    </button>
                </form>
            </div>
       </div>
    </div>

    <div class="w-full">
        <div class=" flex items-center px-10 pb-5 md:pl-0 bg-slate-400">
            <div class="bg-gray-100 py-2 px-2 rounded-l-md"><Search /></div>
            <input type="text" name="searchBar" id="searchBar" bind:value={searchBarString} class="bg-gray-100 rounded-r-md w-full py-2 focus:outline-none"/>
        </div>
        <div class="flex gap-5 md:hidden my-5 mx-10 justify-between">
            <div class="w-full">
                <button type="button" on:click={()=> dialogDirCreate.showModal()} class="button bg-black text-white text-lg rounded-md py-1 px-2 flex flex-row items-center w-full">
                    <div>
                        <FolderPlus size={24}/>
                    </div>
                    <div class="grow text-center">
                        Создать папку
                    </div>
                </button>
            </div>
            <form method="POST" action="?/upload" enctype="multipart/form-data" class="w-full" use:enhance>
                <label for="file">
                    <div class="button bg-black text-white text-lg rounded-md py-1 px-2 flex flex-row items-center w-full cursor-pointer">
                        <div>
                            <Upload size={24}/>
                        </div>
                        <div class="grow text-center">
                            Загрузить файл
                        </div>
                    </div>
                    <input type="file" name="file" id="file" class="hidden" onchange="form.submit()" /> 
                </label>
                {#if form}
                    <p>{form.message}</p>
                {/if}
            </form>
        </div>
        <div class="mx-10 my-5 flex md:flex-row flex-col justify-between items-center">
            <div class="mb-3 md:mb-0 flex items-center">
                <p class="text-xl font-medium">{data.path?.split("/").pop() ?? ""}</p>
            </div>
            <div class="flex flex-row gap-5">
                <div>
                    <button on:click={() => grid = "1"} class="{grid == "1" ? 'bg-slate-400' : ''} rounded-md p-1" >
                        <AlignJustify />
                    </button>
                    <button on:click={() => grid = "2"} class="{grid == "2" ? 'bg-slate-400' : ''} rounded-md p-1">
                        <LayoutGrid />
                    </button>
                </div>
                <div>
                    <button on:click={() => selected = "1"} class="{selected == "1" ? 'bg-slate-400' : ''} rounded-md p-1"><ArrowDownAZ /></button>
                    <button on:click={() => selected = "2"} class="{selected == "2" ? 'bg-slate-400' : ''} rounded-md p-1"><ArrowDownZA /></button>
                    <button on:click={() => selected = "3"} class="{selected == "3" ? 'bg-slate-400' : ''} rounded-md p-1"><ArrowDown10 /></button>
                    <button on:click={() => selected = "4"} class="{selected == "4" ? 'bg-slate-400' : ''} rounded-md p-1"><ArrowDown01 /></button>
                </div>
            </div>
        </div>
        {#if grid === "1"}
        <div class="flex flex-col justify-center mx-10">    
            {#each searched as file (file.id)}
                <File id={file.id} name={file.name} type={file.type} size={file.size} />
            {:else }
                <p class="text-lg text-center">Ничего не найдено</p>
            {/each}
        </div>
        {:else }
        <div class="flex flex-row flex-wrap gap-5 mx-10">    
            {#each searched as file (file.id)}
                <FileTile id={file.id} name={file.name} type={file.type} size={file.size} />
            {:else }
                <div class="w-full">
                    <p class="text-lg text-center">Ничего не найдено</p>
                </div>
            {/each}
        </div>
        {/if}
    </div>
</div>




<dialog id="createDirDialog" class="shadow-lg rounded-lg w-80" bind:this={dialogDirCreate}>
    <div class="text-end pt-2 pr-3">
        <button on:click={() => {
            dialogDirCreate.close();
            newDirName = "";
        }}>
            X
        </button>
    </div>
    <h2 class="text-3xl mt-5 text-center">Создание папки</h2>
    <div class="flex flex-col items-center justify-center p-5">
        <form action="?/createDir" method="post" class="w-full">
            <div class="mb-5">
                <label for="newDirName" class="block font-medium px-2">Имя папки</label>
                <input bind:value={newDirName} type="text" name="newDirName" id="newDirName" required class="bg-gray-100 rounded-md w-full py-2 px-3 focus:outline-none focus:ring"/>
            </div>
            {#if !isValid}
                <p class="text-red-600 text-sm mb-5 text-center">Имя папки не может содержать символы {list}</p>
            {/if}
            <button disabled={!isValid || isEmpty} type="submit" class="button bg-black text-white rounded-md py-1 px-2 text-center w-full disabled:bg-gray-400">Создать</button>
        </form>
    </div>
</dialog>
