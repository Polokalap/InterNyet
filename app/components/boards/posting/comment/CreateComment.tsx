"use client"

import { useState } from "react";
import Check from "@/app/components/verification/Check";
import { createComment } from "@/app/board/actions";
import Bubble from "@/app/components/bubble/Bubble";
import CommentPreview from "@/app/components/boards/posting/comment/CommentPreview";

type Props = {
    user: { id: number; name: string; display: string; color: string; created: number; cooldowns: Record<string, number> } | null;
    board: string;
    postId: number;
};

export default function CreateComment({ user, board, postId }: Props) {

    const [finished, setFinished] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [content, setContent] = useState("");
    const [media, setMedia] = useState("");

    if (!user) return null;

    return (

        <>

            <form action={createComment} className={"flex flex-col gap-3 w-full ml-3"}>

                <div className={"w-full"}>

                    { isPreview && <CommentPreview user={user} media={media} contents={content} /> }

                </div>

                <table className={`w-full max-w-100 border-separate border-spacing-[2px] ${isPreview ? "hidden" : ""}`}>

                    <tbody>

                        <tr>

                            <th className="w-25 h-full bg-[#721C24] text-white text-left border border-black px-1">Description</th>

                            <td>
                                <textarea
                                    className={"block w-full h-28 input px-1 py-0.5 resize-none"}
                                    name={"content"}
                                    placeholder="Your comment's description"
                                    onChange={(e) => setContent(e.target.value)}
                                    value={content}
                                />
                            </td>

                        </tr>

                        <tr>

                            <th className="w-25 h-full bg-[#721C24] text-white text-left border border-black px-1">Media</th>

                            <td>
                                <input
                                    className={"button-secondary w-full"}
                                    name={"media"}
                                    type={"file"}
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];

                                        if (file && file.type.startsWith("image/")) {
                                            setMedia(URL.createObjectURL(file));
                                        } else {
                                            setMedia("");
                                            e.target.value = "";
                                        }
                                    }}
                                />
                            </td>

                        </tr>

                    </tbody>

                </table>

                <div className="flex flex-row gap-1 w-110 items-center justify-center">

                    <input className={"hidden"} type={"text"} name={"board"} value={board} readOnly />
                    <input className={"hidden"} type={"number"} name={"postId"} value={postId} readOnly />

                    <Check action={"createComment"} setFinished={setFinished} />

                    <button
                        className={`button-secondary${finished && content.length >= 3 ? "" : "-disabled"}`}
                        type="button"
                        onClick={() => {setIsPreview(!isPreview);}}
                        disabled={ !finished || content.length < 3 }
                    >
                        { isPreview ? "Edit" : "Preview" }
                    </button>

                    <button
                        className={`button-primary${finished && content.length >= 3 ? "" : "-disabled"}`}
                        type={"submit"}
                        disabled={ !finished || content.length < 3 }
                    >
                        Post
                    </button>

                    <Bubble description={"Requirements to post: \n - At least a 3 characters long description"} />

                </div>

            </form>

        </>

    )

}