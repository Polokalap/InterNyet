"use server"

import { verifyTurnstile } from "@/app/lib/security";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/lib/auth";
import { createBoardPost, Post } from "@/app/lib/board";

export async function createPost(formData: FormData) {

    if (!(await verifyTurnstile(formData, "createBoardPost"))) {

        redirect("?error=true&code=16");

    }

    const user = await requireUser();

    const title = String(formData.get("title") ?? "");
    const board = String(formData.get("board") ?? "");
    const content = String(formData.get("content") ?? "");
    const media = formData.get("media");

    if (media != null && media instanceof File && media.size > 0) {

        if (media.size > 10 * 1024 * 1024) {

            redirect("?error=true&code=12");

        }

    } else {

        redirect("?error=true&code=29");

    }

    const result = await createBoardPost(user, board, title, content, media);

    if ("success" in result && !result.success || !(result instanceof Post)) {

        redirect(`?error=true&code=${result.code}`);

    }

    redirect(`/boards/${encodeURIComponent(board)}/posts/${result.id}`)

}