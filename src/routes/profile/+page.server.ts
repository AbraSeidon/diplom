import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { MAX_SPACE } from "$lib/server/utils";

export const load: PageServerLoad = async ({locals}) => {
    if (!locals.user)
        redirect(302, "/")

    return {
        user: locals.user,
        maxSpace: MAX_SPACE,
    }
};