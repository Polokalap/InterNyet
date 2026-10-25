import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validate } from "@/app/lib/auth";
import NavBar from "@/app/components/navbar/NavBar";
import { login } from "@/app/account/actions";
import { getMessage } from "@/app/lib/messages";
import Check from "@/app/components/verification/Check";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string, code?: string }>; }) {

    const storage = await cookies();
    const token = storage.get("session");

    const result = token ? await validate(token.value) : null;

    if (result?.success) {

        redirect("/account");

    }

    const { error, code } = await searchParams;

    return (

        <>

            <div className={"flex flex-col gap-10 w-full md:w-215 mt-0 m-auto p-5"}>

                <NavBar />

                <div className={"flex flex-col w-75 h-100 m-auto border-2 bg-[#FFF9F0] items-center"}>

                    <div className={"flex flex-row justify-between pl-1 pr-1 w-full border-b-1 bg-[#721C24] items-center"}>

                        <p className={"text-white font-bold text-lg"}>Log in</p>

                    </div>

                    <form action={login} className="flex flex-col gap-5 items-center">

                        <p className={"text-3xl"}>Log in</p>

                        <div className={"flex flex-col"}>

                            <div className={"flex flex-col"}>

                                <p>Username:</p>
                                <input name={"user"} className={"input"} type="text" maxLength={16} />

                            </div>

                            <div className={"flex flex-col"}>

                                <p>Password:</p>
                                <input name={"password"} className={"input"} type="password" maxLength={128} />

                            </div>

                            <Check action={"login"}/>

                        </div>

                        <button className={"button-primary scale-125"} type={"submit"}>Log in</button>

                        <p>Don't have an account yet? <a href="/account/register">register!</a></p>

                        {error && <p className="text-red-700">{getMessage(code) ?? "Invalid username or password"}</p>}

                    </form>

                </div>

            </div>

        </>

    )

}