import { generateIdFromEntropySize } from "lucia";
import { prisma } from "./prisma";
import { TimeSpan, createDate } from "oslo";
import nodemailer from 'nodemailer';
import { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } from "$env/static/private";

export function isValidEmail(email: string): boolean {
	return /.+@.+/.test(email);
}

export async function createEmailVerificationToken(email: string): Promise<string> {
	await prisma.emailVerificationToken.deleteMany({
		where :{
			userEmail: email,
		}
	})

	const emailVerificationToken = generateIdFromEntropySize(20);
	await prisma.emailVerificationToken.create({
		data: {
			id: emailVerificationToken,
			userEmail: email,
			expiresAt: createDate(new TimeSpan(2, 'h')),
		}
	})

	return emailVerificationToken
}

export function createNodemailerTransport() {
	const transporter = nodemailer.createTransport({
		host: "smtp.mail.ru",
		port: 465,
		secure: true,
		auth: {
			user: NODEMAILER_EMAIL,
			pass: NODEMAILER_PASSWORD,
		},
	});

	return transporter;
}