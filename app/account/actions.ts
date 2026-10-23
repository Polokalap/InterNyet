"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authenticate, addUser, removeSession } from "@/app/lib/auth";

export async function login(formData: FormData) {

    const user = String(formData.get("user") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await authenticate(user, password);

    if (!result.success || !result.key) {

        redirect(`/account/login?error=true&code=${result.code}`);

    }

    (await cookies()).set("session", result.key, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 180,
    });

    redirect("/account");

}

export async function register(formData: FormData) {

    const user = String(formData.get("user") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await addUser(user, password);

    if (!result.success || !result.key) {

        redirect(`/account/register?error=true&code=${result.code}`);

    }

    (await cookies()).set("session", result.key, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 180,
    });

    redirect("/account");

}

export async function logout() {

    const storage = await cookies();
    const session = storage.get("session");

    if (session) {

        await removeSession(session.value);

    }

    storage.delete("session");
    redirect("/account/login");

}