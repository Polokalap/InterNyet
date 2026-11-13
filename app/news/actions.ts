"use server"

import { verifyTurnstile } from "@/app/lib/security";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/lib/auth";
import {createNewsPost, News} from "@/app/lib/news";

export async function createPost(formData: FormData) {

    if (!(await verifyTurnstile(formData, "createPost"))) {

        redirect("/news/posts/new?error=true&code=16");

    }

    const user = await requireUser();

    if (user.role < 1) {

        return redirect("/");

    }

    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");

    const result = await createNewsPost(user.id, title, content);

    if ("success" in result && !result.success || !(result instanceof News)) {

        redirect(`/news/posts/new?error=true&code=${result.code}`);

    }

    redirect(`/news/${result.id}`)

}