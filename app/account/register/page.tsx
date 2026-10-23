import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validate } from "@/app/lib/auth";
import NavBar from "@/app/components/navbar/NavBar";
import { register } from "@/app/account/actions";
import { getMessage } from "@/app/lib/messages";

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

            <div className={"flex flex-col gap-10 w-full md:w-215 mt-0 m-auto pt-5 pb-5"}>

                <NavBar />

                <div className={"flex flex-col w-75 h-100 m-auto border-2 bg-[#FFF9F0] items-center"}>

                    <div className={"flex flex-row justify-between pl-1 pr-1 w-full border-b-1 bg-[#721C24] items-center"}>

                        <p className={"text-white font-bold text-lg"}>Register</p>

                    </div>

                    <form action={register} className="flex flex-col gap-5 items-center">

                        <p className={"text-3xl"}>Register</p>

                        <div className={"flex flex-col"}>

                            <div className={"flex flex-col"}>

                                <p>Username:</p>
                                <input name={"user"} className={"border-1"} type="text" maxLength={16} />

                            </div>

                            <div className={"flex flex-col"}>

                                <p>Password:</p>
                                <input name={"password"} className={"border-1"} type="password" maxLength={128} />

                            </div>

                        </div>

                        <button className={"button scale-125"} type={"submit"}>Register</button>

                        <p>Already have an account? <a href="/account/login">log in!</a></p>

                        {error && <p className="text-red-700">{getMessage(code) ?? "Invalid username or password"}</p>}

                    </form>

                </div>

            </div>

        </>

    )

}