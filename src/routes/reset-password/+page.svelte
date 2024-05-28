
<script>
    export let form;
</script>


<div>
<h1>Reset password</h1>
{#if !form?.success}
<form method="POST">
    <label>
        Email
        <input type="email" name="email">
    </label>
    <br>
    <button type="submit">Reset</button>
</form>
{:else}
<p>If your email is verified, you will get a link for recovering your password.</p>
{/if}
</div>