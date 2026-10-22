import { redirect } from "next/navigation";
import { logout } from "@/app/account/actions";

export default async function Page() {

    await logout();
    redirect("/account/login");

    return null;

}