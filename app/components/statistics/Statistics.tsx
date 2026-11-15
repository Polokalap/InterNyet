import { getUserCount } from "@/app/lib/auth";
import { getInteractions, getThreads } from "@/app/lib/board";

export default async function Statistics() {

    const users = await getUserCount();
    const threads = await getThreads();
    const interactions = await getInteractions();

    return (

        <>

            <div className={"flex flex-col gap-1 w-full min-h-65 border-2 bg-[#FFF9F0]"}>

                <div className={"flex flex-row justify-between pl-1 pr-1 w-full border-b-1 bg-[#721C24] items-center"}>

                    <p className={"text-white font-bold text-lg"}>Statistics</p>

                </div>

                <div className={"flex flex-row w-full h-full overflow-x-auto overflow-y-hidden bg-[#FFF9F0] md:pr-15 md:pl-15 md:justify-between text-sm pt-6"}>

                    <div className={"flex flex-row p-5 justify-between"}>

                        <div className={"flex flex-col gap-1 w-35 items-center text-center"}>

                            <img
                                src={"assets/icons/users.png"}
                                alt={"Users"}
                                width={96}
                            />

                            <h1 className={"text-2xl"}>{ users } Users</h1>

                        </div>

                    </div>

                    <div className={"flex flex-row p-5 justify-between"}>

                        <div className={"flex flex-col gap-1 w-40 items-center text-center"}>

                            <img
                                src={"assets/icons/threads.png"}
                                alt={"Threads"}
                                width={96}
                            />

                            <h1 className={"text-2xl"}>{ threads } Threads</h1>

                        </div>

                    </div>

                    <div className={"flex flex-row p-5 justify-between"}>

                        <div className={"flex flex-col gap-1 w-40 items-center text-center"}>

                            <img
                                src={"assets/icons/posts.png"}
                                alt={"Posts"}
                                width={96}
                            />

                            <h1 className={"text-2xl"}>{ interactions } Interactions</h1>

                        </div>

                    </div>

                </div>

            </div>

        </>

    )

}