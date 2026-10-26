import NavBar from "@/app/components/navbar/NavBar";
import { requireUser } from "@/app/lib/auth"
import {getMessage} from "@/app/lib/messages";
import LogoutForm from "@/app/components/account/logout/LogoutForm";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string, code?: string }>; }) {

    const user = await requireUser();
    const { error, code } = await searchParams;

    return (

        <>

            <div className={"flex flex-col gap-10 w-full md:w-215 mt-0 m-auto p-5"}>

            <NavBar />

                <div className={"flex flex-col w-150 h-60 m-auto border-2 bg-[#FFF9F0] items-center"}>

                    <div className={"flex flex-row justify-between pl-1 pr-1 w-full border-b-1 bg-[#721C24] items-center"}>

                        <p className={"text-white font-bold text-lg"}>Log out</p>

                    </div>

                    <div className={"flex flex-col gap-4 items-center p-5"}>

                        <h1 className={"text-3xl font-bold"}>Are you sure you want to log out?</h1>

                        <p>Logging out will terminate this session, logging out any accounts that use the current session. You should ignore this, if you didn't share this session with another user.</p>

                        <div className={"flex flex-row w-full justify-evenly p-20 pt-3"}>

                            <LogoutForm />

                            <a href={"/account"}><button className={"button-secondary scale-125"}>No, go back</button></a>

                        </div>

                        {error && <p className="text-red-700 m-auto">{getMessage(code) ?? "Invalid username or password"}</p>}

                    </div>

                </div>

            </div>

        </>

    )

}