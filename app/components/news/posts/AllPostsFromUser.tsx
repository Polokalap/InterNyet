import { getPostCountFromUser, getPostsFromUser } from "@/app/lib/news";
import SmallPost from "./SmallPost";
import PageNavigator from "@/app/components/navigator/PageNavigator";

const LIMIT = 10;

export default async function AllPosts({ searchParams, id }: { searchParams: Promise<{ page?: string }>; id: number }) {

    const { page } = await searchParams;
    const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);
    const totalPages = Math.max(Math.ceil(await getPostCountFromUser(id) / LIMIT), 1);

    const posts = await getPostsFromUser(currentPage * LIMIT - LIMIT, currentPage * LIMIT, id);

    return (

        <>

            <div className={"flex flex-col gap-10"}>

                {Array.isArray(posts) ? (

                    posts.map((post) => <SmallPost key={post.id} id={`${post.id}`} />)

                ) : (

                    <h1 className="text-4xl text-red-500 m-auto">Error displaying news</h1>

                )}

                <PageNavigator page={currentPage} totalPages={totalPages} />

            </div>

        </>

    )

}