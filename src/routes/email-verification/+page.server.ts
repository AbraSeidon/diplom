import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { createEmailVerificationToken, createNodemailerTransport } from "$lib/server/utils";
import { NODEMAILER_EMAIL } from "$env/static/private";

export const load: PageServerLoad = async () => {
    redirect(302, "/");
};

export const actions: Actions = {
    default: async ({ locals, url }) => {
        if (!locals.user || locals.user.email_verified)
            redirect(302, "/");
        
        const origin = url.origin;
        const emailVerificationToken = await createEmailVerificationToken(locals.user.email);
		const emailVerificationLink = origin+"/email-verification/"+ emailVerificationToken;
		
        try {
            const transporter = createNodemailerTransport();
            transporter.sendMail({
                from: NODEMAILER_EMAIL,
                to: locals.user.email,
                subject: "Письмо для подтверждения аккаунта ddisk",
                text: `${emailVerificationLink}`,
                html: `<a>${emailVerificationLink}</a>`
            })
        } catch(e) {
            console.log(e);
            throw error(400, "Ошибка при отправке письма для подтверждения аккаунта ddisk")
        }
        
        redirect(302, "/");
    }
};