<script>
    export let form;
</script>

<div class="flex flex-col items-center justify-center h-screen">
	<div class="flex flex-col items-center justify-center w-80 border shadow-lg rounded-lg p-5">
		<h1 class="text-3xl">Смена пароля</h1>
		<form method="post" class="w-full">
			<div class="mb-5">
				<label for="newPassword" class="block font-medium px-2">Новый пароль</label>
				<input required type="password" name="newPassword" id="newPassword" class="bg-gray-100 rounded-md w-full py-2 px-3 focus:outline-none focus:ring" />
			</div>
			<div class="mb-5">
				<label for="newPasswordConfirmation" class="block font-medium px-2">Повторите новый пароль</label>
				<input required type="password" name="newPasswordConfirmation" id="newPasswordConfirmation" class="bg-gray-100 rounded-md w-full py-2 px-3 focus:outline-none focus:ring" />
			</div>
			{#if form?.message}
			    <p class="text-red-600 text-center font-medium mb-5">{form?.message}</p>
			{/if}
			<button type="submit" class="button bg-black text-white rounded-md text-lg py-2 px-3 text-center w-full">Сохранить новый пароль</button>
		</form>
	</div>
</div>