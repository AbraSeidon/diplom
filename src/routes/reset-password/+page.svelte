
<script>
    export let data;
    export let form;

    const email = data.user.email;
</script>

<div class="flex flex-col items-center justify-center h-screen">
	<div class="flex flex-col items-center justify-center min-w-80 border shadow-lg rounded-lg p-5 m-5">
		<h1 class="text-3xl mb-5">Сброс пароля</h1>
        {#if !form?.success}
            <form method="POST" class="w-full">
                {#if email}
                    <p class="mb-5">Email: {email}</p>
                {:else}
                    <div class="mb-5">
                        <label for="email" class="block font-medium px-2">Email</label>
                        <input required type="email" name="email" id="email" class="bg-gray-100 rounded-md w-full py-2 px-3 focus:outline-none focus:ring"/>
                    </div>
                    {#if form?.message}
                        <p class="text-red-600 text-center font-medium mb-5">{form?.message}</p>
                    {/if}
                {/if}
                <button type="submit" class="button bg-black text-white rounded-md text-lg py-2 px-3 text-center w-full">Сбросить пароль</button>
            </form>
        {:else}
            <p class="text-center font-medium">Если адрес электронной почты подтвержден, на почту будет выслано письмо со ссылкой для сброса пароля</p>
        {/if}
	</div>
</div>
