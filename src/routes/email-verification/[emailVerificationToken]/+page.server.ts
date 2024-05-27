import { prisma } from "$lib/server/prisma";
import { lucia } from "$lib/server/auth";
import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { isWithinExpirationDate } from "oslo";

export const load: PageServerLoad = async (event) => {

    if(event.locals.user?.email_verified) {
        error(404, "your email is already verified");
    }

    const emailVerificationToken = event.params.emailVerificationToken;

    const existingEmailVerificationToken = await prisma.emailVerificationToken.findUnique({
        where: {
            id: emailVerificationToken,
        }
    });
    
    if (!existingEmailVerificationToken) {
        return error(404, "There is no such token");
    }

    await prisma.emailVerificationToken.delete({
        where: {
            id: emailVerificationToken,
        }
    });

    if (!isWithinExpirationDate(existingEmailVerificationToken.expiresAt)) {
        return error(404, "Token is expired");
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: existingEmailVerificationToken.userEmail,
        }
    })

    await lucia.invalidateUserSessions(existingUser!.id);
    await prisma.user.update({
        where: {
            id: existingUser!.id,
        },
        data: {
            email_verified: true,
        }
    });

    const session = await lucia.createSession(existingUser!.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
    });

    redirect(302, "/");

};