import ToMarkdown from "@/app/components/markdown/Markdown";
import Bubble from "@/app/components/bubble/Bubble";

type Props = {
    id: number;
}

export default function SmallPost({ id }: Props) {

    

    return (

        <>

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

                <div className={"flex flex-col gap-2 bg-[#FFF9F0] border-1 w-full p-1 items-center"}>

                    <h1 className={"text-3xl font-bold"}>The site has been updated blah blah blah</h1>

                    <div className={"flex flex-col gap-1 w-full pr-2 pl-2"}>

                        <ToMarkdown text={"Meow meow meow"} />

                    </div>

                </div>

            </div>

        </>

    )

}