import NavBar from "@/app/components/navbar/NavBar";
import {getUser, getUserByUsername} from "@/app/lib/auth";
import Card from "@/app/components/user/Card";
import AllBoardPostsFromUser from "@/app/components/boards/posting/AllBoardPostsFromUser";

export default async function Page({ params, searchParams }: { params: Promise<{ id: number; }>; searchParams: Promise<{ page?: string }>; }) {

    const { id } = await params;
    const { page } = await searchParams;

    let user;

    if (id.toString().startsWith("%40")) {

        user = await getUserByUsername(id.toString().replace("%40", ""));

    } else {

        user = await getUser(id);

    }

    if (!user) {

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

                    <AllBoardPostsFromUser id={`${user.id}`} page={`${page}`} />

                </div>

            </div>

        </>

    )

}