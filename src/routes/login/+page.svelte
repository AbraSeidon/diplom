<script lang="ts">
	export let form;
</script>
<!-- 
<h1>Log in</h1>
<form method="post">
	<label for="email">Email</label>
	<input name="email" id="email" value={form?.email ?? ''}/><br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /><br />
	{#if form?.message}
		<p>{form?.message}</p>
	{/if}
	<button>Continue</button>
</form>
<a href="/reset-password">Forgot the password</a> -->

<div class="flex flex-col items-center justify-center h-screen">
	<div class="flex flex-col items-center justify-center min-w-80">
		<h1 class="text-3xl">Вход</h1>
		<form method="post" class="w-full">
			<div class="mb-5">
				<label for="email" class="block font-medium px-2">Email</label>
				<input required type="email" name="email" id="email" value={form?.email ?? ''} class="bg-gray-100 rounded-md w-full py-2 px-3 focus:outline-none focus:ring"/>
			</div>
			<div class="mb-5">
				<label for="password" class="block font-medium px-2">Пароль</label>
				<input  required type="password" name="password" id="password" class="bg-gray-100 rounded-md w-full py-2 px-3 focus:outline-none focus:ring" />
			</div>
			{#if form?.message}
			<p class="text-red-600 text-center font-medium mb-5">{form?.message}</p>
			{/if}
			<button type="submit" class="button bg-black text-white rounded-md text-lg py-2 px-3 text-center w-full">Войти</button>
		</form>
		<a href="/reset-password" class="underline">Забыли пароль?</a>
		<p>Ещё нет аккунта? <a href="/signup" class="underline">Зарегистрируйтесь</a> </p>
	</div>
</div>