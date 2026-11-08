import { readFile, rename } from "node:fs/promises";
import path from "node:path"
import { getCommentById, PostComment } from "@/app/lib/board";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    if (!/^\d+$/.test(id)) {

        return new Response("Invalid id", { status: 400 });

    }

    const comment = await getCommentById(id);

    if (!comment || !(comment instanceof PostComment)) {

        return new Response("Invalid id", { status: 400 });

    }

    const dir = path.join(process.cwd(), "data", "user", `${comment.account}`, "comments", `${comment.id}`);
    const file = path.join(dir, "media");
    const legacyFile = path.join(dir, "media.jpg");

    try {

        await rename(legacyFile, file);

    } catch (err: any) {

        if (err.code !== "ENOENT") throw err;

    }

    try {

        const buffer = await readFile(file);

        return new Response(buffer, {

            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "no-cache",
            },

        });

    } catch (err: any) {

        if (err.code === "ENOENT") {

            return new Response("Comment has no media", { status: 404 });

        }

        throw err;

    }

}