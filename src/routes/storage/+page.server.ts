import { prisma } from "$lib/server/prisma";
import {splitFileName, storageDir } from "$lib/server/utils";
import { generateIdFromEntropySize } from "lucia";
import { error, fail, redirect } from "@sveltejs/kit";
import path from "path";
import * as fs from "node:fs"

import type { Actions, PageServerLoad } from "./$types";


export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user)
        redirect(302, "/");

    const existingFiles = await prisma.file.findMany({
        where: {
            userId: locals.user.id,
            NOT: {
                type: "dir",
            },
        },
    });

    return {
        files: existingFiles,
    }

};

export const actions: Actions = {
    upload: async({ request, locals}) => {
        if (!locals.user)
            redirect(302, "/");

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file)
            return fail(400, { message: "Choose a file to upload"});

        if (file.size === 0 && file.type === "application/octet-stream" && file.name == '')
            return fail(400, {message: "Choose a file to upload"});

        const fileId = generateIdFromEntropySize(10);
        const [fileName, fileType] = splitFileName(file.name);
        const fileSize = file.size;
        const userId = locals.user?.id as string;
        const filePath = path.join(storageDir, userId, file.name);

        console.log("fileName: " + fileName);
        console.log("fileType: " + fileType);
        console.log("storageDir: " + storageDir);
        console.log("userId: " + userId);
        console.log("filePath: " + filePath);



        if (fileName === "" ||
            fileName === " " ||
            fileType === "" ||
            fileType === " " ||
            fileSize == 0
        ) {
            return fail(400, { message: "Invalid file name" })
        }

        const existingFile = await prisma.file.findFirst({
            where: {
                path: filePath,
            },
        });

        if (existingFile)
            return fail(400, {message: "File with this name already exists in this directory"});
        
        
        try {
            await prisma.file.create({
                data: {
                    id: fileId,
                    name: fileName as string,
                    type: fileType as string,
                    size: fileSize,
                    path: filePath,
                    userId: userId,
                }
            })
        } catch (e) {
            console.log(e)
            throw error(400, "Loading to database error");
        }

        try {
            fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
        } catch(e) {
            console.log(e)
            throw error(400, "Error during saving file in filesystem")
        }

        return {message: "done!"}
    }
};