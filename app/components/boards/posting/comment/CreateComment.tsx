"use client"

import { useEffect, useRef, useState } from "react";
import Check from "@/app/components/verification/Check";
import { commentOnComment, createPostComment } from "@/app/board/actions";
import Bubble from "@/app/components/bubble/Bubble";
import CommentPreview from "@/app/components/boards/posting/comment/CommentPreview";
import { User } from "@/app/lib/types";

type Props = {
    user: User | null;
    board?: string;
    postId?: number;
    id?: number;
    setCommenting?: (commenting: boolean) => void;
};

export default function CreateComment({ user, board, postId, id, setCommenting }: Props) {

    const isPost = typeof postId === "number";
    const action = isPost ? createPostComment : commentOnComment;

    const inputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const [finished, setFinished] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [content, setContent] = useState("");
    const [media, setMedia] = useState("");
    const [spoiler, setSpoiler] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const canPost = finished && content.length >= 3 && !submitted;

    useEffect(() => {

        const onPaste = (e: ClipboardEvent) => {

            if (e.target !== contentRef.current) return;

            const files = e.clipboardData?.files;

            if (!files || files.length === 0) return;

            const input = inputRef.current;
            if (!input) return;

            const dt = new DataTransfer();
            for (const file of Array.from(files)) dt.items.add(file);
            input.files = dt.files;

            input.dispatchEvent(new Event("change", {bubbles: true}));

        };

        document.addEventListener("paste", onPaste);
        return () => document.removeEventListener("paste", onPaste);

    }, []);

    if (!user) return null;

    return (

        <>

            <form action={action} className={"flex flex-col gap-3 w-full md:ml-3.5"}>

                <div className={"w-full"}>

                    {isPreview && <CommentPreview user={user} media={media} contents={content} spoiler={spoiler}/>}

                </div>

                <table className={`w-full max-w-100 border-separate border-spacing-[2px] ${isPreview ? "hidden" : ""}`}>

                    <tbody>

                    <tr>

                        <th className="w-25 h-full bg-[#721C24] text-white text-left border border-black px-1">Description</th>

                        <td colSpan={2}>
                                <textarea
                                    className={"block w-full h-28 input px-1 py-0.5 resize-none"}
                                    ref={contentRef}
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
                                className={"button-secondary w-full px-1 py-0.5"}
                                ref={inputRef}
                                name={"media"}
                                type={"file"}
                                accept={"image/*"}
                                multiple
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

                        <td>

                            <label className={"flex flex-row gap-1 w-full input px-1 py-0.5"}>

                                <p className={"select-none"}>Spoiler:</p>

                                <input
                                    name={"spoiler"}
                                    type={"checkbox"}
                                    checked={spoiler}
                                    onChange={() => {
                                        setSpoiler(!spoiler);
                                    }}
                                />

                            </label>

                        </td>

                    </tr>

                    </tbody>

                </table>

                <div className="flex flex-row gap-1 w-110 items-center justify-center">

                    {isPost ? (
                        <>
                            <input className={"hidden"} type={"text"} name={"board"} value={board ?? ""} readOnly/>
                            <input className={"hidden"} type={"number"} name={"postId"} value={postId} readOnly/>
                        </>
                    ) : (
                        <input className={"hidden"} type={"number"} name={"id"} value={id ?? ""} readOnly/>
                    )}

                    <Check action={"createComment"} setFinished={setFinished}/>

                    <button
                        className={`button-secondary${canPost ? "" : "-disabled"}`}
                        type="button"
                        onClick={() => {
                            setIsPreview(!isPreview);
                        }}
                        disabled={!canPost}
                    >
                        {isPreview ? "Edit" : "Preview"}
                    </button>

                    <button
                        className={`button-primary${canPost ? "" : "-disabled"}`}
                        type={"submit"}
                        disabled={!canPost}
                        onClick={() => {
                            setTimeout(() => {

                                setSubmitted(true);

                                if (setCommenting) {

                                    setCommenting(false);

                                }

                            }, 10);
                            setTimeout(() => {

                                setSubmitted(false);

                            }, 5000);

                        }}
                    >
                        Post
                    </button>

                    <Bubble description={"Requirements to post: \n - At least a 3 characters long description"}/>

                </div>

            </form>

        </>

    )

};