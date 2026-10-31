"use server"

import { verifyTurnstile } from "@/app/lib/security";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/lib/auth";
import {createNewsPost, Post} from "@/app/lib/news";

export async function createPost(formData: FormData) {

    if (!(await verifyTurnstile(formData, "login"))) {

        redirect("/news/posts/new?error=true&code=16");

    }

    const user = await requireUser();

    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");

    const result = await createNewsPost(user.id, title, content);

    if ("success" in result && !result.success || !(result instanceof Post)) {

        redirect(`/news/posts/new?error=true&code=${result.code}`);

    }

    redirect(`/news/${result.id}`)

}