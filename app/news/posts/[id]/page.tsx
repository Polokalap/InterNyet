import NavBar from "@/app/components/navbar/NavBar";
import { getUser } from "@/app/lib/auth";
import Card from "@/app/components/user/Card";
import AllPostsFromUser from "@/app/components/news/posts/AllPostsFromUser";

export default async function Page({ params, searchParams }: { params: Promise<{ id: number }>; searchParams: Promise<{ page?: string }>; }) {

    const { id } = await params;
    const user = await getUser(id);

    if (!user || user.role < 1) {

        return (

            <>

                <div className={"flex flex-col gap-4 w-full md:w-215 mt-0 m-auto p-5"}>

                    <NavBar />

                    <div className={"flex flex-col gap-5 w-full m-2 items-center justify-center"}>

                        <h1 className={"text-4xl text-red-600"}>User not found</h1>

                    </div>

                </div>

            </>

        )

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