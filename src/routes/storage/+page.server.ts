import * as fs from "node:fs";
import * as path from "node:path";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { createDirectory } from "$lib/server/utils";

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user)
        redirect(302, "/")


};

export const actions: Actions = {
    default: async({ request, locals}) => {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        // разобрать файл на части

        if (!file)
            return fail(400, { message: "Choose a file to upload"});

        // проверка на странный файл при пустой форме
        if (file.size === 0 && file.type === "application/octet-stream" && file.name == '')
            return fail(400, {message: "Choose a file to upload"});

        // проверка на непустое имя
        if (file.name == '')
            return fail(400, { message: "File has to have a name"});

        // создать путь, куда сохранить

        const createdDirectory = createDirectory("lol", null);
        console.log(createdDirectory);
        

        // fs.writeFileSync(loadingPath, Buffer.from(await file.arrayBuffer()));
        // сохранить информацию о файле в БД
        return {message: "done!"}
    }
};