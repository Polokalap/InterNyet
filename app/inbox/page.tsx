import NavBar from "@/app/components/navbar/NavBar";
import { markInboxViewed } from "@/app/lib/board";
import CreateBoardPost from "@/app/components/boards/posting/CreateBoardPost";
import { getIfUser } from "@/app/lib/auth";
import { getMessage } from "@/app/lib/messages";
import AllInboxPosts from "@/app/components/inbox/AllInboxPosts";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string, code?: string; page?: string; }>; }) {

    const user = await getIfUser();
    const { error, code, page } = await searchParams;

    if (user) {

        await markInboxViewed(user.id);

    } else {

        redirect("/login");

    }

    return (

        <>

            <div className={"flex flex-col gap-4 w-full overflow-clip md:w-215 mt-0 m-auto md:p-5 p-2"}>

                <NavBar />

                <div className={"flex flex-col gap-5 w-full md:m-2"}>

                    <div className={"flex flex-col gap-1 items-center justify-center"}>

                        <h1 className={"text-[#C62828] text-4xl"}>Your inbox</h1>
                        <h2 className={"text-lg"}>The posts of people you interact with will show up here</h2>

                    </div>

                    <AllInboxPosts id={`${user.id}`} page={page} />

                </div>

            </div>

        </>

    )

}