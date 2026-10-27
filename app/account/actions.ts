"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    authenticate,
    addUser,
    removeSession,
    requireUser,
    removeUser,
    setPassword,
    verifyPassword
} from "@/app/lib/auth";
import {getCooldown, setCooldown, setDisplayName, setProfilePicture, setUsername} from "@/app/lib/settings";
import { revalidatePath } from "next/cache";
import { verifyTurnstile } from "@/app/lib/security";

export async function login(formData: FormData) {

    if (!(await verifyTurnstile(formData, "login"))) {

        redirect("/account/login?error=true&code=16");

    }

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

    if (!(await verifyTurnstile(formData, "register"))) {

        redirect("/account/register?error=true&code=16");

    }

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

export async function logout(formData: FormData) {

    if (!(await verifyTurnstile(formData, "logout"))) {

        redirect("/account/logout?error=true&code=16");

    }

    const storage = await cookies();
    const session = storage.get("session");

    if (session) {

        await removeSession(session.value);

    }

    storage.delete("session");
    redirect("/account/login");

}

export async function settings(formData: FormData) {

    if (!(await verifyTurnstile(formData, "settings"))) {

        redirect("/account?error=true&code=16");

    }

    const storage = await cookies();
    const session = storage.get("session");
    const user = await requireUser();

    if (!session) {

        redirect("/account/login");

    }

    const profile = formData.get("profile");

    if (profile instanceof File && profile.size > 0) {

        if (profile.size > 10 * 1024 * 1024) {

            redirect("/account?error=true&code=12");

        }

        const result = await setProfilePicture(session.value, profile);

        if (!result.success) {

            redirect(`/account?error=true&code=${result.code}`);

        }

    }

    const display = formData.get("display");

    if (!(display instanceof File) && display !== "" && display) {

        const result = await setDisplayName(session.value, display);

        if (!result.success) {

            redirect(`/account?error=true&code=${result.code}`);

        }

    }

    const username = formData.get("username");

    if (!(username instanceof File) && username !== "" && username && user.cooldowns["namechange"] == undefined) {

        const result = await setUsername(session.value, username);

        if (!result.success) {

            redirect(`/account?error=true&code=${result.code}`);

        }

    }

    revalidatePath("/account");
    redirect("/account");

}

export async function deleteAccount(formData: FormData) {

    if (!(await verifyTurnstile(formData, "deleteAccount"))) {

        redirect("/account/delete?error=true&code=16");

    }

    const storage = await cookies();
    const session = storage.get("session");

    if (!session) {

        redirect("/account/login");

    }

    const user = await requireUser();
    const password = String(formData.get("password") ?? "");

    const result = await verifyPassword(user.name, password);

    if (!result.success) {

        redirect("/account/delete?error=true&code=22");

    }

    const removal = await removeUser(session.value);

    if (!removal.success) {

        redirect(`/account/delete?error=true&code=${removal.code}`);

    }

    storage.delete("session");
    redirect("/account/login");

}

export async function changePassword(formData: FormData) {

    if (!(await verifyTurnstile(formData, "changePassword"))) {

        redirect("/account/changepass?error=true&code=16");

    }

    const storage = await cookies();
    const session = storage.get("session");

    if (!session) {

        redirect("/account/login");

    }

    const user = await requireUser();
    const currentPassword = String(formData.get("current-password") ?? "");
    const newPassword = String(formData.get("new-password") ?? "");

    if (await getCooldown(user.id, "passwordChange")) {

        redirect("/account/changepass?error=true&code=20");

    }

    const result = await verifyPassword(user.name, currentPassword);

    if (!result.success) {

        redirect("/account/changepass?error=true&code=22");

    }

    const change = await setPassword(user.id, newPassword);

    if (!change.success || !change.key) {

        redirect(`/account/changepass?error=true&code=${change.code}`);

    }

    await removeSession(session.value);

    setCooldown(user.id, "passwordChange", 604800);

    storage.set("session", change.key, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 180,
    });

    redirect("/account");

}