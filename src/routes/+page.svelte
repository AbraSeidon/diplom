<script lang="ts">
    export let data;
</script>

<h1>Welcome to SvelteKit</h1>
{#if !data.user}
    <a href="/signup">sign up</a>
    <a href="/login">log in</a>
{:else}
    <p>hello, {data.user.email}</p>
    <p>your email is {data.user.email_verified ? 'verified' : 'not verified'}</p>
    <form action="/logout" method="POST">
        <button type="submit">log out</button>
    </form>
{/if}
