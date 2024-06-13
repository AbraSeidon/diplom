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
                    <div class="flex">
                         <span class="text-red-600">Нет</span>
                         <form action="/email-verification" method="POST">
                              <button type="submit" class="ms-5 underline underline-offset-2 decoration-dotted">Подтвердить</button>
                         </form>
                    </div>
               {/if}
          </div>
          <div class="mb-5">
               <p class="font-medium">Использовано места</p>
               <p>{(data.user.spaceUsed/1024/1024).toFixed(2)} MB из {data.maxSpace/1024/1024} MB</p>
               <progress id="spaceProgress" max={data.maxSpace} value={data.user.spaceUsed} class="w-full"></progress>
          </div>
          <div class="mb-5">
               <a href="/reset-password" class="button bg-black text-white rounded-md py-2 px-3 text-center">Сменить пароль</a>
          </div>
          <div>
               <form method="POST" action="/logout">
                    <button type="submit" class="button bg-red-600 text-white rounded-md py-2 px-3 text-center">Выйти</button>
               </form>
          </div>
	</div>
</div>
