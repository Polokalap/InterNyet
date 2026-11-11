import NavBar from "@/app/components/navbar/NavBar";
import { getIfUser } from "@/app/lib/auth";
import AllPosts from "@/app/components/news/posts/AllPosts";

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string }>; }) {

    const user = await getIfUser();

    return (

        <>

            <div className={"flex flex-col gap-4 w-full overflow-clip md:w-215 mt-0 m-auto md:p-5 p-2"}>

                <NavBar />

                <div className={"flex flex-col gap-5 w-full m-2"}>

                    {

                        user && user.role > 0 ?

                            (

                                <div className={"flex flex-row justify-end pr-3 pl-3"}>

                                    <a href={"/news/posts/new"}><button type={"button"} className={"button-primary"}>New post</button></a>

                                </div>

                            ) : null

                    }

                </div>

                <AllPosts searchParams={searchParams} />

            </div>

        </>

    )

}