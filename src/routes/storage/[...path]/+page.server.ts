import { prisma } from "$lib/server/prisma";
import { splitFileName, isAllWhitespaces, MAX_SPACE } from "$lib/server/utils";
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
            spaceUsed: locals.user.spaceUsed,
            maxSpace: MAX_SPACE,
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

    return {
        path: urlPath,
        files: await prisma.file.findMany({
            where: {
                parentId: existingDir?.id
            }
        }),
        spaceUsed: locals.user.spaceUsed,
        maxSpace: MAX_SPACE,
    }

};

export const actions: Actions = {
    upload: async({ request, locals, params}) => {
        if (!locals.user)
            redirect(302, "/");

        const dirs = params.path.split("/");

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file)
            return fail(400, { message: "Choose a file to upload" });

        if (file.size === 0 && file.type === "application/octet-stream" && file.name == '')
            return fail(400, { message: "Choose a file to upload" });

        const fileId = generateIdFromEntropySize(10);
        const [fileName, fileType] = splitFileName(file.name);
        const fileSize = file.size;
        const userId = locals.user?.id as string;
        const dirPath =  path.join(".", "storage", userId, ...dirs);
        const filePath = path.join(dirPath, file.name);

        if (isAllWhitespaces(fileName as string) ||
            isAllWhitespaces(fileType as string) ||
            fileSize == 0
        ) {
            return fail(400, { message: "Некорректное имя файла" })
        }

        const existingFile = await prisma.file.findFirst({
            where: {
                path: filePath,
            },
        });

        if (existingFile)
            return fail(400, {message: "Файл с таким именем уже существует"});

        if (locals.user.spaceUsed + fileSize >= MAX_SPACE)
            return fail(400, {message: "Файл слишком большой"})
        
        const parentDir = await prisma.file.findFirst({
            where: {
                path: dirPath,
            }
        });

        try {
            fs.writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
        } catch(e) {
            console.log(e)
            throw error(400, "Ошибка во время сохранения файла")
        }

        try {
            await prisma.file.create({
                data: {
                    id: fileId,
                    name: fileName as string,
                    type: fileType as string,
                    size: fileSize,
                    path: filePath,
                    userId: userId,
                    parentId: parentDir?.id,
                }
            })
        } catch (e) {
            console.log(e)
            throw error(400, "Ошибка во время сохранения файла");
        }
        
        const spaceUsedArray = await prisma.file.groupBy({
            by: 'userId',
            where: {
                userId: locals.user.id,
            },
            _sum: {
                size: true,
            },
        });
        
        let spaceUsed = 0;

        if (spaceUsedArray.length !== 0) {
            spaceUsed = spaceUsedArray[0]._sum.size as number;
        }

        await prisma.user.update({
            where: {
                id: locals.user.id,
            },
            data: {
                spaceUsed: spaceUsed,
            }
        })

        redirect (302, "/storage/"+encodeURIComponent(params.path))
    },

    delete: async({ request, locals, params }) => {
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
                    fs.rmSync(existingFile.path, {recursive: true})
                } else {
                    fs.unlinkSync(existingFile?.path as string); 
                }

                await prisma.file.delete({
                    where: {
                        id: fileId,
                    },
                });

                const spaceUsedArray = await prisma.file.groupBy({
                    by: 'userId',
                    where: {
                        userId: locals.user.id,
                    },
                    _sum: {
                        size: true,
                    },
                });
                
                let spaceUsed = 0;

                if (spaceUsedArray.length !== 0) {
                    spaceUsed = spaceUsedArray[0]._sum.size as number;
                }

                await prisma.user.update({
                    where: {
                        id: locals.user.id,
                    },
                    data: {
                        spaceUsed: spaceUsed,
                    }
                })

                
            }

        redirect(302, "/storage/"+encodeURIComponent(params.path));
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
            if (!existsSync(creatingPath)){
                fs.mkdirSync(creatingPath);
            } else {
                return fail(400, {message: "Папка с таким названием уже есть"})
            }
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
        redirect(302, "/storage/"+encodeURIComponent(event.params.path));
    }
};