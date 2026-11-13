import BoardPost from "../boards/posting/BoardPost";
import PageNavigator from "@/app/components/navigator/PageNavigator";
import { getBoardPostCount, getInboxPosts } from "@/app/lib/board";

const LIMIT = 10;

export default async function AllInboxPosts({ id, page }: { id: string; page?: string; }) {

    const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
    const totalPages = Math.max(Math.ceil(await getBoardPostCount(id) / LIMIT), 1);

    const posts = await getInboxPosts(Number(id), currentPage * LIMIT - LIMIT, currentPage * LIMIT);

    return (

        <>

            <div className={"flex flex-col gap-10"}>

                {Array.isArray(posts) ? (

                    posts.map((post) => <BoardPost key={post.id} post={post} />)

                ) : (

                    <h1 className="text-red-500 m-auto">Your inbox is empty...</h1>

                )}

                { totalPages > 1 && <PageNavigator page={currentPage} totalPages={totalPages} /> }

            </div>

        </>

    )

}