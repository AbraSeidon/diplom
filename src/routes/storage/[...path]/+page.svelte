<script lang="ts">
    import File from '$lib/components/File/File.svelte';

    export let data;
    export let form;
    
    const forbiddenChars: string[] = [".", "/", "\\", "*", "?", "\"", "'", "`", "<", ">", "|", "&"];
    let newDirName: string = "";
    $: list = forbiddenChars.filter(char => newDirName.includes(char) )
    $: isValid = list.length === 0;
    $: isEmpty = newDirName.length === 0;

</script>


<div>
    <button type="button" on:click={()=> window.createDirDialog.showModal()} class="button bg-black text-white rounded-md py-1 px-2 text-center">Создать папку</button>
</div>
<div>
    <form method="POST" action="?/upload" enctype="multipart/form-data">
        <input type="file" name="file" id="file" required/> 
        {#if form}
            <p>{form.message}</p>
        {/if}
        <button type="submit" class="button bg-black text-white rounded-md py-1 px-2 text-center">Загрузить</button>
    </form>
</div>

{#each data.files as file (file.id)}
    <File id={file.id} name={file.name} type={file.type} size={file.size}/>
{/each}

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
