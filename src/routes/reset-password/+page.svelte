
<script>
    export let data;
    export let form;

    const email = data.user.email;
</script>


<!-- <div>
<h1>Reset password</h1>
{#if !form?.success}
<form method="POST">
    <label>
        Email
        <input type="email" name="email" value={email ?? ''} disabled={email ? true : false}>
    </label>
    <br>
    <button type="submit">Reset</button>
</form>
{:else}
<p>If your email is verified, you will get a link for recovering your password.</p>
{/if}
</div> -->


<div>
    <h1>Reset Password</h1>
    {#if !form?.success}
    <form method="POST">
        {#if email}
            <span>Email: {email}</span>
        {:else}
        <label>
            Email: 
            <input type="email" name="email">
        </label>
        {/if}
        <br>
        <button type="submit">Send</button>
    </form>
    {:else}
        <p>If your email is verified, you will get a link for resetting your password.</p>
    {/if}
</div>