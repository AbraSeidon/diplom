import { fail, redirect } from "@sveltejs/kit";
import { generateIdFromEntropySize } from "lucia";
import { hash } from "@node-rs/argon2"
import { prisma } from "$lib/server/prisma";
import { lucia } from "$lib/server/auth";

import type { Actions, PageServerLoad } from "./$types";
import { createEmailVerificationToken, createNodemailerTransport, isValidEmail } from "$lib/server/utils";
import { NODEMAILER_EMAIL } from "$env/static/private";


export const load: PageServerLoad = async ({locals}) => {
	if (locals.user) 
		redirect(302, '/');
};

export const actions: Actions = {
    default: async (event) => {

        const formData = await event.request.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
		const passwordConfirmation = formData.get("passwordConfirmation") as string;

		if (!email || !isValidEmail(email)) {
			return fail(400, { email, message: "Invalid email" });
		}

		if (!password || password.length < 6 ||  password.length > 255) {
			return fail(400, { email, message: "Invalid password" });
		}

		if (password !== passwordConfirmation) {
			return fail(400, { email, message: "Passwords are different" });
		}

		const existingUser = await prisma.user.findUnique({
			where:  {
				email: email,
			},
		});

		if (existingUser)
			return fail(400, { email, message: "This email is already taken" });

        const userId = generateIdFromEntropySize(10); // 16 characters long
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		await prisma.user.create({
            data: {
                id: userId,
                email: email,
                password_hash: passwordHash
            }
		});

		// Отправлять письмо с ссылкой.
		const emailVerificationToken = await createEmailVerificationToken(email);
		const emailVerificationLink = "http://localhost:5173/email-verification/" + emailVerificationToken;
		
		const transporter = createNodemailerTransport();
		transporter.sendMail({
			from: NODEMAILER_EMAIL,
            to: email,
            subject: "Email verification link from ddisk",
            text: `${emailVerificationLink}`,
            html: `<a>${emailVerificationLink}</a>`
		})

		const session = await lucia.createSession(userId, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, "/login");
    }
};