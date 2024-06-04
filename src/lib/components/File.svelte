<script lang="ts">
    export let id: string;
    export let name: string;
    export let type: string;
    export let size: number;
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
        link.setAttribute('download', fileId);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
</script>

<div style="border: solid">
    <p>{name}.{type}</p>
    <p>{size} bytes</p>
    <button on:click={handleDownload}>Скачать</button>
    <form action="?/delete" method="POST">
        <input type="hidden" name="id" value={id}>
        <button type="submit">Удалить</button>
    </form>
</div>