import { prisma } from "$lib/server/prisma";
import { fail, redirect, error } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { isWithinExpirationDate } from "oslo";
import { hash } from "@node-rs/argon2";
import { lucia } from "$lib/server/auth.js";

export const load: PageServerLoad = async ({ params }) => {
    const { passwordResetToken } = params;
    
    const existingPasswordResetToken = await prisma.passwordResetToken.findUnique({
        where: {
            id: passwordResetToken,
        },
    });

    if (!existingPasswordResetToken) {
        throw error(404, "Такой страницы не существует");
    }

    if (!isWithinExpirationDate(existingPasswordResetToken.expiresAt)) {
        await prisma.passwordResetToken.delete({
            where: {
                id: passwordResetToken,
            }
        });

        return error(404, "У ссылки кончился срок годности, создайте новую");
    }

};

    // Тут можно сделать продление жизни токена, если ему осталось мало
    // чтобы 

    export const actions: Actions = {
        default: async ({request, params}) => {

            let errorMessage = "";

            const { passwordResetToken } = params; 

            const formData = await request.formData();
            const newPassword = formData.get("newPassword") as string;
            const newPasswordConfirmation = formData.get("newPasswordConfirmation") as string;
    
            const existingPasswordResetToken = await prisma.passwordResetToken.findUnique({
                where: {
                    id: passwordResetToken,
                },
            });

            if (!existingPasswordResetToken) {
                throw error(404, "Такой страницы не существует");
            }

            if (!isWithinExpirationDate(existingPasswordResetToken.expiresAt)) {
                await prisma.passwordResetToken.delete({
                    where: {
                        id: passwordResetToken,
                    }
                });

                return error(404, "У ссылки кончился срок годности, создайте новую");
            }

            if (!newPassword || newPassword.length < 6 || newPassword.length > 255) {
                errorMessage = "Некорректный пароль";
                return fail(400, { message: errorMessage } );
            }

            if (newPassword !== newPasswordConfirmation) {
                errorMessage = "Пароли отличаются";
                return fail(400, { message: errorMessage} );
            }

            await prisma.passwordResetToken.delete({
                where: {
                    id: passwordResetToken,
                 },
            });

            const newPasswordHash = await hash(newPassword, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1,
            });
            
            await lucia.invalidateUserSessions(existingPasswordResetToken.userId);

            await prisma.user.update({
                where: {
                    id: existingPasswordResetToken.userId,
                },
                data: {
                    password_hash: newPasswordHash,
                },
            });

            throw redirect(302, "/login");

            
        }
    };    




