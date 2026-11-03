"use client"

import { useState } from "react";
import Check from "@/app/components/verification/Check";
import BoardPost from "@/app/components/boards/posting/BoardPost";
import { createPost } from "@/app/board/actions";
import Bubble from "@/app/components/bubble/Bubble";

export default function CreateBoardPost({ user, board }: { user: { id: number; name: string; display: string; color: string; created: number; cooldowns: Record<string, number> } | null, board: string }) {

    const [finished, setFinished] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [media, setMedia] = useState("");

    if (!user) return null;

    return (

        <>

            <form action={createPost} className={"flex flex-col gap-3 w-full items-center justify-center"}>

                <div className={"w-full"}>

                    { isPreview && <BoardPost user={user} title={title} media={media} contents={content} /> }

                </div>

                <table className={`w-full max-w-100 border-separate border-spacing-[2px] ${isPreview ? "hidden" : ""}`}>

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
                                    className={"block w-full h-28 input px-1 py-0.5 resize-none"}
                                    name={"content"}
                                    placeholder="Your post's description"
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

                <div className="flex flex-row items-center gap-1">

                    <input className={"hidden"} type={"text"} name={"board"} value={board} readOnly />

                    <Check action="createBoardPost" setFinished={setFinished} />

                    <button
                        className={`button-secondary${finished && title.length > 3 && content.length >= 10 && media != "" ? "" : "-disabled"}`}
                        type="button"
                        onClick={() => {setIsPreview(!isPreview);}}
                        disabled={ !finished || title.length <= 3 && content.length < 10 && media == ""}
                    >
                        { isPreview ? "Edit" : "Preview" }
                    </button>

                    <button
                        className={`button-primary${finished && title.length > 3 && content.length >= 10 && media != "" ? "" : "-disabled"}`}
                        type={"submit"}
                        disabled={ !finished || title.length <= 3 && content.length < 10 && media == ""}
                    >
                        Post
                    </button>

                    <Bubble description={"Requirements to post: \n- At least a 3 characters long title \n - At least a 10 characters long description \n - Some kind of media (must be an image)"} />

                </div>

            </form>

        </>

    )

}