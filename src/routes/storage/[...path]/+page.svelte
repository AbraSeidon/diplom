<script lang="ts">
    import File from '$lib/components/File/File.svelte';

    export let data;
    export let form;

    
    let selected = '1'
    let sorted: typeof data.files;
    let searchBarString = "";
    let fileInput;

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
        }
       }

    $: searched = sorted.filter((file) => file.name.includes(searchBarString));

</script>

<div class="flex h-screen">
    <div class="md:flex flex-col gap-3 px-3 justify-between hidden bg-gray-300">
        <div>
            <div class="my-5">
                    <button type="button" on:click={()=> window.createDirDialog.showModal()} class="button bg-black text-white text-lg rounded-md py-1 px-2 text-center w-full">Создать папку</button>
            </div>
            <div>
                <form method="POST" action="?/upload" enctype="multipart/form-data">
                    <label for="file">
                        <p class="button bg-black text-white text-lg rounded-md mb-5 py-1 px-2 text-center w-full cursor-pointer">
                            Загрузить файл
                        </p>
                        <input type="file" name="file" id="file" class="hidden" onchange="form.submit()" /> 
                    </label>
                    {#if form}
                        <p>{form.message}</p>
                    {/if}
                </form>
            </div>
        </div>
        <div>
            <div>
                <p class="font-medium">Использовано места</p>
                <p>{data.spaceUsed} байтов из {data.maxSpace} байтов</p>
                <progress id="spaceProgress" max={data.maxSpace} value={data.spaceUsed} class="w-full"></progress>
            </div>

            <div class="my-5">
                <form method="POST" action="/logout">
                    <button type="submit" class="button bg-red-600 text-white text-lg rounded-md py-1 px-2 text-center w-full">Выйти</button>
                </form>
            </div>
       </div>
    </div>

    <div class=w-full>
        <div class="px-10 py-5 md:pl-0 bg-gray-300">
            <input type="text" name="searchBar" id="searchBar" bind:value={searchBarString} class="bg-gray-100 rounded-md w-full py-2 px-3 focus:outline-none focus:ring"/>
        </div>
        <div class="mx-10 my-5 flex justify-between">
            <div>
                <p class="text-xl">{data.path ?? " "}</p>
            </div>
            <div>
                <select name="sort" id="sort" bind:value={selected} class="border rounded-md focus:outline-none">
                    <option value="1">По алфавиту</option>
                    <option value="2">По алфавиту обратно</option>
                    <option value="3">Сначала большие</option>
                    <option value="4">Сначала маленькие</option>
                </select>
            </div>
        </div>
        <div class="flex flex-col justify-center mx-10">    
            {#each searched as file (file.id)}
                <File id={file.id} name={file.name} type={file.type} size={file.size}/>
            {:else }
                <p class="text-lg text-center">Ничего не найдено</p>
            {/each}
        </div>
    </div>
</div>






















<!-- <div class="flex mx-10 gap-5 justify-between items-center my-5">
    <div>
        <button type="button" on:click={()=> window.createDirDialog.showModal()} class="button bg-black text-white rounded-md py-1 px-2 text-center">Создать папку</button>
    </div>
    <div>
        <form method="POST" action="?/upload" enctype="multipart/form-data">
            <input type="file" name="file" id="file" required/> 
            {#if form}
                <p>{form.message}</p>
            {/if}
            <button type="submit" class="button bg-black text-white rounded-md py-1 px-2 text-center">Загрузить файл</button>
        </form>
    </div>
    <div>
        <input type="text" name="searchBar" id="searchBar" bind:value={searchBarString} class="bg-gray-100 rounded-md w-full py-2 px-3 focus:outline-none focus:ring"/>
    </div>
    <div>
        <select name="sort" id="sort" bind:value={selected}>
            <option value="1">По алфавиту</option>
            <option value="2">По алфавиту обратно</option>
            <option value="3">Сначала большие</option>
            <option value="4">Сначала маленькие</option>
        </select>
    </div>
</div>

<div class="flex flex-col justify-center mx-10">    
    {#each searched as file (file.id)}
        <File id={file.id} name={file.name} type={file.type} size={file.size}/>
    {/each}
</div> -->

<dialog id="createDirDialog" class="shadow-lg rounded-lg w-80">
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
            <button disabled={!isValid || isEmpty} type="submit" class="button bg-black text-white rounded-md py-1 px-2 text-center w-full disabled:bg-gray-500">Создать</button>
        </form>
    </div>
</dialog>
