import { requireUser } from "@/app/lib/auth";
import NavBar from "@/app/components/navbar/NavBar";
import { getMessage } from "@/app/lib/messages";
import Card from "@/app/components/user/Card";
import SettingsForm from "@/app/components/account/settings/SettingsForm";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string, code?: string }>; }) {

    const user = await requireUser();
    const { error, code } = await searchParams;

    return (

        <>

            <div className={"flex flex-col gap-4 w-full overflow-clip md:w-215 mt-0 m-auto md:p-5 p-2"}>

                <NavBar />

                <div className={"flex flex-col gap-10"}>

                    {error && <p className="text-red-700 m-auto">{getMessage(code) ?? "Invalid username or password"}</p>}

                    <h1 className={"text-3xl"}>Account information</h1>

                    <Card user={user} self={true} />

                </div>

                <SettingsForm user={user} />

            </div>

        </>

    )

}