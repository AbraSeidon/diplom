<script lang="ts">
    import "../app.css";
    export let data;
</script>

<div class="flex flex-col h-screen">
    <div class="bg-gray-300 flex justify-between pr-10 pl-10 md:pl-5 items-center py-5">
        <div>
            <a href="/" class="text-5xl font-medium">ddisk</a>
        </div>
        <div>
            <a href="/profile" class="button bg-black text-white rounded-md text-lg px-2 py-1 {data.user? '' : 'hidden'}">Профиль</a>
        </div>
    </div>
    <slot></slot>   
</div>
<style></style>