<script lang="ts">
	export let form;

</script>

<h1>Sign up</h1>
<form method="post">
	<label for="email">email</label>
	<input name="email" id="email" value={form?.email ?? ''}/> <br />
	<label for="password">Password</label>
	<input type="password" name="password" id="password" /> <br />
	<label for="passwordConfirmation">Password confirmation</label>
	<input type="password" name="passwordConfirmation" id="passwordConfirmation"> <br />
	{#if form?.message}
		<p style="color: red">{form?.message}</p>
	{/if}   
	<button>Continue</button>
</form>