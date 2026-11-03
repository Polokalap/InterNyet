import NavBar from "@/app/components/navbar/NavBar";
import { getAllBoardIds, getBoardById, getPostById, Post } from "@/app/lib/board";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/lib/auth";
import EditBoardPost from "@/app/components/boards/posting/EditBoardPost";
import { readFile } from "node:fs/promises";
import path from "path";

export default async function Page({ params, searchParams }: { params: Promise<{ id: string, postId: string }>, searchParams: Promise<{ error?: string, code?: string }>; }) {

    const user = await requireUser();

    const { id, postId } = await params;

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

        redirect("/board/posts/not-found");

    }

    if (post.account != user.id) {

        redirect(`/board/${board.id}`);

    }

    const editing = {
        id: post.id,
        account: post.account,
        board: post.board,
        title: post.title,
        path: post.path,
        release: post.release,
    };

    const content = await readFile(path.join(post.path, "post.md"), "utf-8");

    let media = "";

    try {

        const buffer = await readFile(path.join(post.path, "media.jpg"));
        media = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    } catch {

        media = "";

    }

    return (

        <>

            <div className={"flex flex-col gap-4 w-full md:w-215 mt-0 m-auto p-5"}>

                <NavBar />

                <div className={"flex flex-col gap-5 w-full m-2"}>

                    <div className={"flex flex-col gap-1 items-center justify-center"}>

                        <a className={"!no-underline"} href={`/board/${id}`}><h1 className={"text-[#721C24] text-7xl"}>/{ board.id }/</h1></a>
                        <h1 className={"text-[#C62828] text-4xl"}>{ board.name }</h1>

                    </div>

                    <EditBoardPost
                        user={user}
                        board={board.id}
                        editing={editing}
                        defaultTitle={post.title}
                        defaultContent={content}
                        defaultMedia={media}
                    />

                </div>

            </div>

        </>

    )

}