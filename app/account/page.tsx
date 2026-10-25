import { requireUser } from "@/app/lib/auth";
import NavBar from "@/app/components/navbar/NavBar";
import { settings } from "@/app/account/actions";
import { getMessage } from "@/app/lib/messages";
import Card from "@/app/components/user/Card";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string, code?: string }>; }) {

    const user = await requireUser();
    const { error, code } = await searchParams;

    return (

        <>

            <div className={"flex flex-col gap-10 w-full md:w-215 mt-0 m-auto p-5"}>

                <NavBar />

                <div className={"flex flex-col gap-10"}>

                    {error && <p className="text-red-700 m-auto">{getMessage(code) ?? "Invalid username or password"}</p>}

                    <h1 className={"text-3xl"}>Account information</h1>

                    <Card user={user} />

                </div>

                <form className={"flex flex-col gap-3"} action={settings}>

                    <h1 className={"text-3xl"}>Account settings</h1>

                    <br />

                    <div className={"flex flex-row justify-between"}>

                        <p className={"text-lg"}>Profile picture:</p>

                        <input className={"button"} name={"profile"} type="file" />

                    </div>

                    <div className={"flex flex-row justify-between"}>

                        <p className={"text-lg"}>Display name:</p>

                        <input className={"input"} name={"display"} type="text" defaultValue={user.display} placeholder={user.display} />

                    </div>

                    <div className={"flex flex-row justify-between pr-1.5"}>

                        <br />

                        <button type={"submit"} className={"button-primary scale-125"}>Save</button>

                    </div>

                </form>

            </div>

        </>

    )

}