"use server"

import { runAction, verifyTurnstile } from "@/app/lib/security";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/lib/auth";
import { toggleFollowUser } from "@/app/lib/profile";
import { revalidatePath } from "next/cache";

export async function toggleFollow(formData: FormData) {

    if (!(await verifyTurnstile(formData, "follow"))) {

        redirect("?error=true&code=16");

    }

    const action = await runAction("follow");

    if (!action.allowed) {

        redirect("?error=true&code=34")

    }

    const user = await requireUser();

    const followed = Number(formData.get("user"));

    if (!Number.isInteger(followed) || followed <= 0) {

        redirect("?error=true&code=26");

    }

    if (followed === user.id) {

        redirect("?error=true&code=7");

    }

    const result = await toggleFollowUser(user.id, followed);

    if (!result.success) {

        redirect(`?error=true&code=${result.code}`);

    }

    revalidatePath(`/profile/${followed}`);
    revalidatePath(`/profile/${user.id}`);

}