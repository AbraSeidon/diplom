import { NODEMAILER_EMAIL } from "$env/static/private";
import { prisma } from "$lib/server/prisma";
import { createNodemailerTransport, createPasswordResetToken, isValidEmail } from "$lib/server/utils";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    return {
        user: {
            email: locals.user?.email

        }
    }
};

export const actions: Actions = {
    default: async({ request, locals, url }) => {

        let email;

        if (locals.user?.email) {
            email = locals.user.email;
        } else {
            const formData = await request.formData();
            email = formData.get("email") as string;
        }

        if (!isValidEmail(email))
            return fail(400, {message: "Некорректный email"});

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!existingUser) {
            return { success: true }
        }

        if (!existingUser.email_verified){
            return { success: true }
        }

        const origin = url.origin;
        const passwordResetToken = await createPasswordResetToken(existingUser.id);
        const passwordResetLink = origin+"/reset-password/"+passwordResetToken;

        const transporter = createNodemailerTransport();
        transporter.sendMail({
			from: NODEMAILER_EMAIL,
            to: existingUser.email,
            subject: "Ссылка для сброса пароля на сервисе ddisk",
            text: `${passwordResetLink}`,
            html: `<a>${passwordResetLink}</a>`
		})
        
        return { success: true }
    }
};