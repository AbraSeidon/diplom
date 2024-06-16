import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {

    console.log(process.cwd());
    return {
        user: locals.user
    }
};