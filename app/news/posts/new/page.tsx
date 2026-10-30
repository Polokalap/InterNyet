import NavBar from "@/app/components/navbar/NavBar";
import { requireUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import CreateForm from "@/app/components/news/create/CreateForm";

export default async function Page() {

    const user = await requireUser();

    if (!user || user.role < 1) {

        redirect("/news");

    }

    return (

        <>

            <div className={"flex flex-col gap-8 w-full md:w-215 mt-0 m-auto p-5 items-center"}>

                <NavBar />

                <h1 className={"text-3xl"}>New post</h1>

                <CreateForm user={user} />

            </div>

        </>

    )

}