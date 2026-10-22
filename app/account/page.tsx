import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validate } from "@/app/lib/auth";
import { logout } from "./actions";

export default async function Page() {

    const storage = await cookies();
    const token = storage.get("session");

    if (!token) {

        redirect("/account/login");

    }

    const result = await validate(token.value);

    if (!result.success) {

        await logout();
        redirect("/account/login");

    }

    return (

        <>



        </>

    )

}