"use client"

import { useState } from "react";
import { createPost } from "@/app/news/actions";
import Check from "@/app/components/verification/Check";

export default function CreateBoardPost({ user }: { user: { id: number; name: string; display: string; color: string; created: number; cooldowns: Record<string, number> } | null  }) {

    const [finished, setFinished] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    if (!user) return null;

    return (

        <>

            <form action={createPost} className={"flex flex-col gap-3 w-full items-center justify-center"}>

                <table className="w-full max-w-100 border-separate border-spacing-[2px]">

                    <tbody>

                        <tr>

                            <th className="w-25 bg-[#721C24] text-white text-left border border-black px-1">Post title</th>

                            <td>
                                <input
                                    className="block w-full input px-1 py-0.5"
                                    type="text"
                                    name="title"
                                    placeholder="Your post's title"
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title}
                                />
                            </td>

                        </tr>

                        <tr>

                            <th className="w-25 h-full bg-[#721C24] text-white text-left border border-black px-1">Description</th>

                            <td>
                                <textarea
                                    className="block w-full h-28 input px-1 py-0.5 resize-none"
                                    name="description"
                                    placeholder="Your post's description"
                                    onChange={(e) => setContent(e.target.value)}
                                    value={content}
                                />
                            </td>

                        </tr>

                    </tbody>

                </table>

                <div className="flex flex-col items-center gap-1">

                    <Check action="createPost" setFinished={setFinished} />
                    <button className={`button-primary${finished ? "-disabled" : ""}`} type="submit">Post</button>

                </div>

            </form>

        </>

    )

}