import { generateIdFromEntropySize } from "lucia";
import { prisma } from "./prisma";
import { TimeSpan, createDate } from "oslo";
import nodemailer from 'nodemailer';
import { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } from "$env/static/private";
import path from "path"
import * as fs from "node:fs"

export const MAX_SPACE = 10*1024*1024;
const storageDir = path.join("storage");

export function isValidEmail(email: string): boolean {
	return /.+@.+/.test(email);
}

export async function createEmailVerificationToken(email: string): Promise<string> {
	await prisma.emailVerificationToken.deleteMany({
		where :{
			userEmail: email,
		}
	});

	const emailVerificationToken = generateIdFromEntropySize(20);
	await prisma.emailVerificationToken.create({
		data: {
			id: emailVerificationToken,
			userEmail: email,
			expiresAt: createDate(new TimeSpan(2, 'h')),
		}
	});

	return emailVerificationToken;
}

export async function createPasswordResetToken(userId: string): Promise<string> {
	await prisma.passwordResetToken.deleteMany({
		where :{
			userId: userId,
		}
	});

	const passwordResetToken = generateIdFromEntropySize(20);
	await prisma.passwordResetToken.create({
		data: {
			id: passwordResetToken,
			userId: userId,
			expiresAt: createDate(new TimeSpan(2, 'h')),
		}
	});

	return passwordResetToken;
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


export function createDirectory(dirName: string, parentId: string | null): string {
	let newDirPath = storageDir;

	if (parentId) {
		newDirPath = path.join(newDirPath, parentId);
	}
    
	newDirPath = path.join(newDirPath, dirName);
	fs.mkdirSync(path.join(newDirPath), { recursive: true});

	return newDirPath;
}

export function splitFileName(name: string) {
    const array = name.split(".");
    const fileType = array.pop();
    const fileName = array.join(".");
    return [fileName, fileType]
}

export function isAllWhitespaces(str: string): boolean {
	return !/\S/.test(str);
}
