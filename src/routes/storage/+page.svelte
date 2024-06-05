<script lang="ts">
    import File from '$lib/components/File/File.svelte';

    export let data;
    export let form;
</script>

<form method="POST" action="?/upload" enctype="multipart/form-data">
    <label>
        Файл для загрузки
        <input type="file" name="file" id="file" required/> 
    </label>
    <br>
    {#if form}
        <p>{form.message}</p>
    {/if}
    <button type="submit">Upload file</button>
</form>

{#each data.files as file (file.id)}
    <File id={file.id} name={file.name} type={file.type} size={file.size}/>
{/each}