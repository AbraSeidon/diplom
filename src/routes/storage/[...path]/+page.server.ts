import { prisma } from "$lib/server/prisma";
import { splitFileName, storageDir, isAllWhitespaces } from "$lib/server/utils";
import { generateIdFromEntropySize } from "lucia";
import { error, fail, redirect } from "@sveltejs/kit";
import path from "path";
import * as fs from "node:fs"

import type { Actions, PageServerLoad } from "./$types";
import { existsSync } from "fs";


export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user)
        redirect(302, "/");
    
    const urlPath = params.path;

    const dirs = urlPath.split("/");

    if (dirs.length === 1 && dirs[0] === "") {
        const existingFiles = await prisma.file.findMany({
            where: {
                userId: locals.user.id,
                parentId: null,
            },
        });

        return {
            files: existingFiles,
        }
    }

    const forbiddenChars = [".", "/", "\\", "*", "?", "\"", "'", "`", "<", ">", "|", "&"];

    for (const dir of dirs) {
        for (const char of forbiddenChars){
            if (dir.includes(char)) {
                redirect(302, "/");
            }
        }
    }

    for (const dir of dirs) {
        if (isAllWhitespaces(dir)) {
            redirect(302, "/");
        }
    }
    
    const searchingPath = path.join(".", "storage", locals.user.id, ...dirs);

    if (!existsSync(searchingPath)) {
        redirect(302, "/");
    }
    
    // ПЕРЕДЕЛАТЬ ПОД FINDUNIQUE, ПУТИ ФАЙЛОВ ДОЛЖНЫ БЫТЬ УНИКАЛЬНЫ
    const existingDir = await prisma.file.findFirst({
        where: {
            path: searchingPath,
        },
    });


    const existingFiles = await prisma.file.findMany({
        where: {
            parentId: existingDir?.id
        }
    })

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

        if (isAllWhitespaces(fileName as string) ||
            isAllWhitespaces(fileType as string) ||
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

        redirect(302, "/storage")
    },

    delete: async({ request, locals }) => {
        if (!locals.user)
            redirect(302, "/");

        const formData = await request.formData();
        const fileId = formData.get("id") as string;

        const existingFile = await prisma.file.findUnique({
            where: {
                id: fileId,
            },
        });

        if(fs.existsSync(existingFile?.path as string))
            {
                if (existingFile?.type === "dir"){
                    fs.rmdirSync(existingFile.path)
                } else {
                    fs.unlinkSync(existingFile?.path as string);
                }

                await prisma.file.delete({
                    where: {
                        id: fileId,
                    },
                });
            }


        redirect(302, "/storage");
    },
    createDir: async(event) => {
        if (!event.locals.user)
            redirect(302, "/");

        const formData = await event.request.formData();
        const dirName = formData.get("newDirName") as string;

        if (!dirName)
            redirect(302, "/storage")

        if (dirName.length === 0)
            redirect(302, "/storage");

        const forbiddenChars = [".", "/", "\\", "*", "?", "\"", "'", "`", "<", ">", "|", "&"];
        const list = forbiddenChars.filter(char => dirName.includes(char) )
        if (list.length !== 0)
            redirect(302, "/storage");

        if (isAllWhitespaces(dirName))
            redirect(302, "/storage");

        const dirs = event.params.path.split("/");
        const creatingPath = path.join(".", "storage", event.locals.user.id, ...dirs, dirName)

        try {
            fs.mkdirSync(creatingPath);
        } catch(e) {
            console.log(e);
            redirect(302, "/storage");
        }

        const parent  = await prisma.file.findFirst({
            where: {
                path: path.join(".", "storage", event.locals.user.id, ...dirs),
                type: "dir",
            },
        });

        const parentId = parent?.id;

        try {
            await prisma.file.create({
                data: {
                    id: generateIdFromEntropySize(10),
                    name: dirName,
                    type: "dir",
                    path: creatingPath,
                    size: 0,
                    userId: event.locals.user.id,
                    parentId: dirs.length === 0 ? null : parentId, 
                },
            });
            
        } catch(e) {
            console.log(e);
            if (fs.existsSync(creatingPath))
                fs.rmdirSync(creatingPath);
            redirect(302, "/storage");
        }
        
    }
};