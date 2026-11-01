import NavBar from "@/app/components/navbar/NavBar";
import { requireUser } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Card from "@/app/components/user/Card";
import AllPostsFromUser from "@/app/components/news/posts/AllPostsFromUser";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }>; }) {

    const user = await requireUser();

    if (!user || user.role < 1) {

        redirect("/news");

    }

    return (

        <>

            <div className={"flex flex-col gap-4 w-full md:w-215 mt-0 m-auto p-5"}>

                <NavBar />

                <div className={"flex flex-col gap-5 w-full m-2"}>

                    <Card user={user} />

                    <AllPostsFromUser searchParams={searchParams} id={user.id} />

                </div>

            </div>

        </>

    )

}