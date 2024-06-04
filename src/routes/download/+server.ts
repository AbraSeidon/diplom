import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";
import * as fs from "fs";
import mime from "mime";

export const GET: RequestHandler = async ({url}) => {
    const fileId = url.searchParams.get('fileId') as string;

    if (!fileId)
        return new Response("empty parameter");

    const existingFile = await prisma.file.findUnique({
        where: {
            id: fileId,
        },
    });

    if (!existingFile || existingFile.type == "dir")
        return new Response("There is no file with such id");

    if (!fs.existsSync(existingFile.path))
        return new Response("There is no file in this path");

    const fileContents = fs.readFileSync(existingFile.path);
    const fileMIME = mime.getType(existingFile.type);

    
    return new Response(fileContents, {
        headers: {
            "Content-type": fileMIME!,
        }
    });
};