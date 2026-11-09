import { readFile } from "node:fs/promises";
import path from "node:path"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params;

    if (!/^\d+$/.test(id)) {

        const file = path.join(process.cwd(), "templates", "user", "profile.jpeg");

        const buffer = await readFile(file);

        return new Response(buffer, {

            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "no-cache",
            },

        });

    }

    const file = path.join(process.cwd(), "data", "user", id, "profile.jpeg");

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

            const file = path.join(process.cwd(), "templates", "user", "profile.jpeg");

            const buffer = await readFile(file);

            return new Response(buffer, {

                headers: {
                    "Content-Type": "image/png",
                    "Cache-Control": "no-cache",
                },

            });

        }

        throw err;

    }

}