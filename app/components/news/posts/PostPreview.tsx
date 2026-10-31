import ToMarkdown from "@/app/components/markdown/Markdown";
import Bubble from "@/app/components/bubble/Bubble";

type Props = {
    title: string;
    contents: string;
    user: { id: number; name: string; display: string; color: string; created: number; cooldowns: Record<string, number> };
}

export default function PostPreview({ contents, title, user }: Props) {

    // eslint-disable-next-line react-hooks/purity
    const epoch = Date.now();
    const date = new Date(epoch);

    return (

        <>

            <div className={"flex flex-col gap-1"}>

                <div className={"flex flex-row justify-between mb-1 items-center"}>

                    <div className={"flex flex-row gap-1 items-center"}>

                        <img src="/api/account/1/profile.jpeg" alt="Profile picture" className={"border-1"} width={30} />
                        <p className={`font-bold text-[${user.color}]`}>{ user.display }</p>
                        <Bubble description={"This user is an administrator"} />

                    </div>

                    <div>

                        <p className={"text-inherit text-zinc-500"}>{ date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) }</p>

                    </div>

                </div>

                <div className={"flex flex-col gap-2 bg-[#FFF9F0] border-1 w-full p-1 items-center"}>

                    <h1 className={"text-3xl font-bold"}>{ title }</h1>

                    <div className={"flex flex-col gap-1 w-full pr-2 pl-2"}>

                        <ToMarkdown text={contents} />

                    </div>

                </div>

            </div>

        </>

    )

}