import NavBar from "@/app/components/navbar/NavBar";
import Bubble from "@/app/components/bubble/Bubble";
import ToMarkdown from "@/app/components/markdown/Markdown";

export default function Page() {

    return (

        <>

            <div className={"flex flex-col gap-4 w-full md:w-215 mt-0 m-auto p-5"}>

                <NavBar />

                <div className={"flex flex-col gap-5 w-full m-2"}>

                    <div className={"flex flex-col gap-1"}>

                        <div className={"flex flex-row justify-between mb-1 items-center"}>

                            <div className={"flex flex-row gap-1 items-center"}>

                                <img src="/api/account/1/profile.jpeg" alt="Profile picture" className={"border-1"} width={30} />
                                <p className={"font-bold text-[#c40000]"}>Polokalap</p>
                                <Bubble description={"This user is an administrator"} />

                            </div>

                            <div>

                                <p className={"text-inherit text-zinc-500"}>2026. October 29.</p>

                            </div>

                        </div>

                        <div className={"flex flex-col gap-2 bg-[#FFF9F0] border-1 w-full max-h-150 p-1 items-center"}> {/* Dummy post */}

                            <h1 className={"text-3xl font-bold"}>The site has been updated blah blah blah</h1>

                            <div className={"flex flex-col gap-1 w-full pr-2 pl-2"}>

                                <ToMarkdown text={" leo nec nisl tempus mollis. Nunc cursus, quam ac dapibus dignissim, felis purus aliquet erat, nec vestibulum neque ipsum a lectus. Donec laoreet dictum dictum. Phasellus suscipit dictum semper. Curabitur porttitor fringilla orci eu ornare. Fusce a nulla augue. Fusce fermentum ipsum vel ipsum rutrum pellentesque. Donec id metus velit. Etiam nec ipsum orci. Suspendisse ultrices velit quis eros vulputate, ut rutrum ante imperdiet.\n"} />

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>

    )

}