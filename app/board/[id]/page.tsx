import NavBar from "@/app/components/navbar/NavBar";
import { getAllBoardIds, getBoardById } from "@/app/lib/board";
import { redirect } from "next/navigation";
import CreateBoardPost from "@/app/components/boards/posting/CreateBoardPost";
import { getIfUser } from "@/app/lib/auth";
import { getMessage } from "@/app/lib/messages";
import AllBoardsPosts from "@/app/components/boards/posting/AllBoardPosts";

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ error?: string, code?: string; page?: string; }>; }) {

    const { id } = await params;
    const user = await getIfUser();
    const boards = getAllBoardIds();
    const { error, code, page } = await searchParams;

    if (!boards.includes(id)) {

        redirect("/board/not-found");

    }

    const board = getBoardById(id);

    if (!board) {

        redirect("/board/not-found");

    }

    return (

        <>

            <div className={"flex flex-col gap-4 w-full overflow-clip md:w-215 mt-0 m-auto md:p-5 p-2"}>

                <NavBar />

                <div className={"flex flex-col gap-5 w-full md:m-2"}>

                    <div className={"flex flex-col gap-1 items-center justify-center"}>

                        <a className={"!no-underline"} href={`/board/${id}`}><h1 className={"text-[#721C24] text-7xl"}>/{ board.id }/</h1></a>
                        <h1 className={"text-[#C62828] text-4xl"}>{ board.name }</h1>

                    </div>

                    <div className={"flex flex-col w-full justify-center items-center"}>

                        {error && <p className="text-red-700">{getMessage(code) ?? "Invalid username or password"}</p>}

                        {
                            user ?

                                (

                                    <CreateBoardPost user={user} board={board.id} />

                                )

                            :

                                <p className={"text-red-600"}>Create an account to post!</p>

                        }

                    </div>

                    <AllBoardsPosts id={board.id} page={page} />

                </div>

            </div>

        </>

    )

}