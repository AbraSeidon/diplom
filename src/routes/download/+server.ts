import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/prisma";
import * as fs from "fs";
import mime from "mime";
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = async ({url, locals}) => {

    if (!locals.user)
        redirect(302,"/");

    const fileId = url.searchParams.get('fileId') as string;

    if (!fileId)
        redirect(302, "/storage");

    const existingFile = await prisma.file.findUnique({
        where: {
            id: fileId,
        },
    });

    if (!existingFile || existingFile.type == "dir")
        redirect(302, "/storage");

    if (existingFile.userId !== locals.user.id)
        redirect(302, "/storage");

    if (!fs.existsSync(existingFile.path))
        redirect(302, "/storage");

    const fileContents = fs.readFileSync(existingFile.path);
    const fileMIME = mime.getType(existingFile.type);

    
    return new Response(fileContents, {
        headers: {
            "Content-type": fileMIME!,
        }
    });
};