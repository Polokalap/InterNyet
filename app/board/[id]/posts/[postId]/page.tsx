import NavBar from "@/app/components/navbar/NavBar";
import { getAllBoardIds, getBoardById, getPostById, Post } from "@/app/lib/board";
import { redirect } from "next/navigation";
import { getIfUser } from "@/app/lib/auth";
import BoardPost from "@/app/components/boards/posting/BoardPost";

export default async function Page({ params, searchParams }: { params: Promise<{ id: string, postId: string }>, searchParams: Promise<{ error?: string, code?: string }>; }) {

    const { id, postId } = await params;
    const user = await getIfUser();
    const boards = getAllBoardIds();
    const { error, code } = await searchParams;

    if (!boards.includes(id)) {

        redirect("/board/not-found");

    }

    const board = getBoardById(id);

    if (!board) {

        redirect("/board/not-found");

    }

    const post = await getPostById(postId);

    if (!post || !(post instanceof Post)) {

        redirect("/board/not-found");

    }

    return (

        <>

            <div className={"flex flex-col gap-4 w-full md:w-215 mt-0 m-auto p-5"}>

                <NavBar />

                <div className={"flex flex-col gap-5 w-full m-2"}>

                    <BoardPost post={post} />

                </div>

            </div>

        </>

    )

}