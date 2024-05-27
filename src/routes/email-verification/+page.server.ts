import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { createEmailVerificationToken, createNodemailerTransport } from "$lib/server/utils";
import { NODEMAILER_EMAIL } from "$env/static/private";

// Задача страницы: реагировать на экшн, чтобы отправить на почту пользователя ссылку для подтверждения почты.
// На этой странице только экшн


export const load: PageServerLoad = async () => {
    redirect(302, "/");
};

export const actions: Actions = {
    default: async ({ locals }) => {
        if (!locals.user || locals.user.email_verified)
            redirect(302, "/");
        
        const emailVerificationToken = await createEmailVerificationToken(locals.user.email);
		const emailVerificationLink = "http://localhost:5173/email-verification/" + emailVerificationToken;
		
		const transporter = createNodemailerTransport();
		transporter.sendMail({
			from: NODEMAILER_EMAIL,
            to: locals.user.email,
            subject: "Email verification link from ddisk",
            text: `${emailVerificationLink}`,
            html: `<a>${emailVerificationLink}</a>`
		})
        
        redirect(302, "/");
    }
};