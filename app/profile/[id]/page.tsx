import NavBar from "@/app/components/navbar/NavBar";
import { getIfUser, getUser, getUserByUsername } from "@/app/lib/auth";
import Card from "@/app/components/user/Card";
import AllBoardPostsFromUser from "@/app/components/boards/posting/AllBoardPostsFromUser";
import {getMessage} from "@/app/lib/messages";

export default async function Page({ params, searchParams }: { params: Promise<{ id: number; }>; searchParams: Promise<{ page?: string; error: boolean; code: string; }>; }) {

    const { id } = await params;
    const { page, error, code } = await searchParams;

    const viewer = await getIfUser();

    let user;

    if (id.toString().startsWith("%40")) {

        user = await getUserByUsername(id.toString().replace("%40", ""));

    } else {

        user = await getUser(id);

    }

    if (!user) {

        return (

            <>

                <div className={"flex flex-col gap-4 w-full overflow-clip md:w-215 mt-0 m-auto md:p-5 p-2"}>

                    <NavBar />

                    {error && <p className={"text-red-700 self-center"}>{getMessage(code) ?? "Invalid username or password"}</p>}

                    <div className={"flex flex-col gap-5 w-full m-2 items-center justify-center"}>

                        <h1 className={"text-4xl text-red-600"}>User not found</h1>

                    </div>

                </div>

            </>

        )

    }

    return (

        <>

            <div className={"flex flex-col gap-4 w-full overflow-clip md:w-215 mt-0 m-auto md:p-5 p-2"}>

                <NavBar />

                {error && <p className={"text-red-700 self-center"}>{getMessage(code) ?? "Invalid username or password"}</p>}

                <div className={"flex flex-col gap-5 w-full"}>

                    <Card user={user} self={viewer ? viewer.id == user.id : false} />

                    <AllBoardPostsFromUser id={`${user.id}`} page={`${page}`} />

                </div>

            </div>

        </>

    )

}