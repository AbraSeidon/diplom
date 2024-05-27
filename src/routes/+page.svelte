<script lang="ts">
    export let data;
</script>

<h1>Welcome to SvelteKit</h1>
{#if !data.user}
    <a href="/signup">sign up</a>
    <a href="/login">log in</a>
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
    <form action="/logout" method="POST">
        <button type="submit">log out</button>
    </form>
{/if}
