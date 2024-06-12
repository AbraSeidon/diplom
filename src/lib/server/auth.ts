import { prisma } from "./prisma"
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { dev } from "$app/environment";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// `true` when using HTTPS
			secure: !dev,
			sameSite: "strict",
		}
	},
	// Здесь мы указываем, какие поля о пользователе мы хотим вернуть после валидации в хуке c помощью функции lucia, 
	// потому что из коробки она не возвращает все поля, чтобы обезопасить от случайного раскрытия.
	// Чтобы она знала, какие типы у этих полей, ниже в интерфейсе описываем, а в декларации имплементируем этот интерфейс.
    getUserAttributes: (attributes) => {
        return {
			id: attributes.id,
            email: attributes.email,
			email_verified: attributes.email_verified,
			spaceUsed: attributes.spaceUsed,
        }
    }
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
        DatabaseUserAttributes: IDatabaseUserAttributes
	}
}

// Здесь мы описываем, какие в таблице пользователей есть поля и какого они типа.
interface IDatabaseUserAttributes {
	id: string,
    email: string,
	email_verified: boolean,
	spaceUsed: number,
}