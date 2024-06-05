<script lang="ts">
    export let data;
</script>

<div class="flex flex-col items-center justify-center h-screen">
	<div class="flex flex-col justify-center min-w-80 border shadow-lg rounded-lg p-5 m-5">
		<h1 class="text-3xl text-center mb-5">Профиль</h1>
       <div class="mb-5">
            <p class="font-medium">Email</p>
            <span>{data.user.email}</span>
       </div>
       <div class="mb-5">
            <p class="font-medium">Подтвержден</p>
            {#if data.user.email_verified}
                <span class="text-green-500">Да</span>
            {:else}
                <span class="text-red-600">Нет</span>
                <a href="/email-verification" class="ms-5 underline underline-offset-2 decoration-dotted">Подтвердить</a>
            {/if}
       </div>
       <div class="mb-5">
            <p class="font-medium">Использовано места</p>
            <span>## байтов из ### байтов</span>
       </div>
       <div class="mb-5">
            <a href="/reset-password" class="button bg-black text-white rounded-md py-2 px-3 text-center">Сменить пароль</a>
       </div>
       <div>
            <form method="POST" action="/logout">
                <button type="submit" class="button bg-black text-white rounded-md py-2 px-3 text-center">Выйти</button>
            </form>
       </div>
	</div>
</div>

<style>
    *{
        /* border: solid green; */
    }
</style>