<script lang="ts">

    export let form;
</script>

<form method="POST" enctype="multipart/form-data">
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