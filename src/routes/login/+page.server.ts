import { fail, redirect } from "@sveltejs/kit";
import { verify } from "@node-rs/argon2";
import { lucia } from "$lib/server/auth";
import { prisma } from "$lib/server/prisma";

import type { Actions, PageServerLoad } from "./$types";
import { isValidEmail } from "$lib/server/utils";

export const load: PageServerLoad = async ({locals}) => {
	if (locals.user) 
		redirect(302, '/');
};
export const actions: Actions = {
    default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		if (!email || !isValidEmail(email)) {
			return fail(400, { email, message: "Invalid email" });
		}

		if (!password || password.length < 6 || password.length > 255) {
			return fail(400, { email, message: "Invalid password" });
		}

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
		
		if (!existingUser) {
			return fail(400, {
				email,
				message: "Incorrect email or password"
			});
		}

		const validPassword = await verify(existingUser.password_hash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		
		if (!validPassword) {
			return fail(400, {
				email,
				message: "Incorrect email or password"
			});
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, "/");
	}
};