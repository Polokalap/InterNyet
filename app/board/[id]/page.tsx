import NavBar from "@/app/components/navbar/NavBar";
import { getAllBoardIds, getBoardById } from "@/app/lib/board";
import { redirect } from "next/navigation";
import CreateBoardPost from "@/app/components/boards/posting/CreateBoardPost";
import { getIfUser } from "@/app/lib/auth";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;
    const user = await getIfUser();
    const boards = getAllBoardIds();

    if (!boards.includes(id)) {

        redirect("/board/not-found");

    }

    const board = getBoardById(id);

    if (!board) {

        redirect("/board/not-found");

    }

    return (

        <>

            <div className={"flex flex-col gap-4 w-full md:w-215 mt-0 m-auto p-5"}>

                <NavBar />

                <div className={"flex flex-col gap-5 w-full m-2"}>

                    <div className={"flex flex-col gap-1 items-center justify-center"}>

                        <h1 className={"text-[#721C24] text-7xl"}>/{ board.id }/</h1>
                        <h1 className={"text-[#C62828] text-4xl"}>{ board.name }</h1>

                    </div>

                    { user && <CreateBoardPost user={user} /> }

                </div>

            </div>

        </>

    )

}