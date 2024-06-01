<script>
    export let form;
</script>

<div class="flex flex-col justify-center items-center">
<h1 class="text-2xl mb-3">Reset password</h1>
<form method="POST" >
    <label>
        New Password
        <input type="password" name="newPassword" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full">
    </label>
    <br>
    <label>
        New password confirmation
        <input type="password" name="newPasswordConfirmation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full">
    </label>
    <br>
    <button type="submit" class="bg-slate-900 hover:bg-slate-700 text-white focus:ring-4 focus:ring-slate-500 font-medium rounded-lg text-sm px-3 py-3 me-2 w-full">Reset</button>
    {#if form}
        <p class="text-red-600">{form?.message}</p>
    {/if}
</form>
</div>