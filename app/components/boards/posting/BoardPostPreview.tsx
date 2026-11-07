"use client"

import ToMarkdown from "@/app/components/markdown/Markdown";
import Bubble from "@/app/components/bubble/Bubble";
import {useState} from "react";
import Image from "next/image";

type Props = {
    title: string;
    contents: string;
    media: string;
    spoiler: boolean;
    user: { id: number; name: string; display: string; color: string; created: number; cooldowns: Record<string, number> };
}

export default function BoardPostPreview({ media, contents, title, user, spoiler }: Props) {

    // eslint-disable-next-line react-hooks/purity
    const epoch = Date.now();
    const date = new Date(epoch);

    const [fullImage, setFullImage] = useState(false);

    return (

        <>

            <div className={"flex flex-col gap-1"}>

                <div className={"flex flex-row justify-between mb-1 items-center"}>

                    <div className={"flex flex-row gap-1 items-center"}>

                        <img src={`/api/account/${user.id}/profile.jpeg`} alt="Profile picture" className={"border-1"} width={30} />
                        <p className={`font-bold`} style={{ color: user.color }}>{ user.display }</p>

                    </div>

                    <div>

                        <p className={"text-inherit text-zinc-500"}>{ date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) }</p>

                    </div>

                </div>

                <div className={"flex flex-col gap-2 bg-[#FFF9F0] border-1 w-full p-1 items-center"}>

                    <h1 className={"text-3xl font-bold"}>{ title }</h1>

                    <div className={"flex flex-col gap-1 w-full pr-2 pl-2"}>

                        { media && (
                            <div className="overflow-clip w-fit max-w-full border-1">
                                <img
                                    src={media}
                                    alt={"Post media"}
                                    className={`${fullImage ? "max-w-full" : "max-w-50"} max-h-96 self-start cursor-pointer ${spoiler && !fullImage ? "blur-sm" : ""}`}
                                    onClick={() => setFullImage(!fullImage)}
                                />
                            </div>
                        ) }

                        <ToMarkdown text={contents} />

                    </div>

                </div>

            </div>

        </>

    )

}