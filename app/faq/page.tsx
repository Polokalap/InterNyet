import NavBar from "@/app/components/navbar/NavBar";
import FileMarkdown from "@/app/components/markdown/FileMarkdown";

export default function Page({ searchParams }: { searchParams: Promise<{ page?: string }>; }) {

    return (

        <>

            <div className={"flex flex-col gap-4 w-full md:w-215 mt-0 m-auto p-5"}>

                <NavBar />

                <div className={"flex flex-col gap-2 items-center p-2 bg-[#FFF9F0] border-1"}>

                    <h1 className={"text-4xl font-bold"}>FAQ</h1>
                    <div className={"justify-start w-full"}>

                        <FileMarkdown path={"texts/faq.md"} />

                    </div>

                </div>

            </div>

        </>

    )

}