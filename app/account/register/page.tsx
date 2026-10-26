import {requireNoUser, validate} from "@/app/lib/auth";
import NavBar from "@/app/components/navbar/NavBar";
import RegisterForm from "@/app/components/account/register/RegisterForm";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string, code?: string }>; }) {

    await requireNoUser();
    const { error, code } = await searchParams;

    return (

        <>

            <div className={"flex flex-col gap-10 w-full md:w-215 mt-0 m-auto p-5"}>

            <NavBar />

                <div className={"flex flex-col w-75 h-100 m-auto border-2 bg-[#FFF9F0] items-center"}>

                    <div className={"flex flex-row justify-between pl-1 pr-1 w-full border-b-1 bg-[#721C24] items-center"}>

                        <p className={"text-white font-bold text-lg"}>Register</p>

                    </div>

                    <RegisterForm error={error} code={code} />

                </div>

            </div>

        </>

    )

}