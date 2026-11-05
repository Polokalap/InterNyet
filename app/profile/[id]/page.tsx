import NavBar from "@/app/components/navbar/NavBar";
import SmallPost from "@/app/components/news/posts/SmallPost";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    return (

        <>

            <div className={"flex flex-col gap-4 w-full md:w-215 mt-0 m-auto p-5"}>

                <NavBar />

                <div className={"flex flex-col gap-5 w-full m-2"}>

                    <SmallPost id={id} />

                </div>

            </div>

        </>

    )

}