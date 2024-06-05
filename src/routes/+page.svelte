<script lang="ts">
    export let data;
</script>

<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-lg">Добро пожаловать в</h1>
    <h1 class="text-7xl font-medium tracking-[.5em] mr-[-.5em]">ddisk</h1>
    <h2 class="text-lg">средство для хранения файлов</h2>
    <div class="mx-12 my-5">
    {#if !data.user}
    <div class="grid grid-cols-2 gap-4">    
        <a href="/signup" class="button bg-black text-white rounded-md text-lg py-2 px-3 text-center">Регистрация</a>
        <a href="/login" class="button bg-black text-white rounded-md text-lg py-2 px-3 text-center">Вход</a>
    </div>
    {:else}
    <div>
        <p>hello, {data.user.email}</p>
    </div>
    <div>    
        <p>your email is {data.user.email_verified ? 'verified' : 'not verified'}</p>
        {#if !data.user.email_verified}
        <form action="/email-verification" method="POST">
            <button type="submit">Send verification mail</button>
    </form>
    {/if}
    </div>
    <a href="/reset-password">Change password</a>
    <form action="/logout" method="POST">
        <button type="submit">log out</button>
    </form>
    <a href="/storage">storage</a>
    {/if}
</div>
</div>

