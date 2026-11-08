"use client"

import ToMarkdown from "@/app/components/markdown/Markdown";
import { useState } from "react";

type Props = {
    contents: string;
    media?: string;
    spoiler: boolean;
    user: { id: number; name: string; display: string; color: string; created: number; cooldowns: Record<string, number> };
}

export default function CommentPreview({ media, contents, user, spoiler = false }: Props) {

    // eslint-disable-next-line react-hooks/purity
    const epoch = Date.now();
    const date = new Date(epoch);

    const [fullImage, setFullImage] = useState(false);

    return (

        <>

            <div className={"flex flex-col gap-1 mt-5"}>

                <div className={"flex flex-row gap-3 justify-between mb-1 items-center w-110"}>

                    <div className={"flex flex-row gap-1 items-center"}>

                        <img src={`/api/account/${user.id}/profile.jpeg`} alt="Profile picture" className={"border-1"} width={30} />
                        <p className={`font-bold`} style={{ color: user.color }}>{ user.display }</p>

                    </div>

                    <p className={"text-inherit text-zinc-500"}>{ date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) }</p>

                </div>

                <div className={"relative flex flex-col gap-2 bg-[#FFF9F0] border-1 min-w-50 max-w-110 p-1 pt-3 pb-3 items-center"}>

                    <div className={"flex flex-col gap-1 w-full pr-2 pl-2"}>

                        <ToMarkdown text={contents} />

                        { media && (
                            <div className="overflow-clip w-fit max-w-full border-1">
                                <img
                                    src={media}
                                    alt={"Comment media"}
                                    className={`${fullImage ? "max-w-full" : "max-w-50"} max-h-96 self-start cursor-pointer ${spoiler && !fullImage ? "blur-sm" : ""}`}
                                    onClick={() => setFullImage(!fullImage)}
                                />
                            </div>
                        ) }

                    </div>

                </div>

            </div>

        </>

    )

}