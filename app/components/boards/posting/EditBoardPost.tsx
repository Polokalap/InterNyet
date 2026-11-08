"use client"

import {useEffect, useRef, useState} from "react";
import Check from "@/app/components/verification/Check";
import { updatePost } from "@/app/board/actions";
import Bubble from "@/app/components/bubble/Bubble";
import BoardPostPreview from "@/app/components/boards/posting/BoardPostPreview";

type Props = {
    user:
        {
            id: number;
            name: string;
            display: string;
            color: string;
            created: number;
            cooldowns: Record<string, number>
        } | null,
    board: string;
    editing: {
        id: number;
        account: number;
        board: string;
        title: string;
        path: string;
        release: number;
    };
    defaultTitle?: string;
    defaultContent?: string;
    defaultMedia?: string;
    defaultSpoiler?: boolean;
}

export default function EditBoardPost({ user, board, editing, defaultTitle = "", defaultContent = "", defaultMedia = "", defaultSpoiler = false }: Props) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [finished, setFinished] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [title, setTitle] = useState(defaultTitle);
    const [content, setContent] = useState(defaultContent);
    const [media, setMedia] = useState(defaultMedia);
    const [spoiler, setSpoiler] = useState(defaultSpoiler);

    useEffect(() => {

        const onPaste = (e: ClipboardEvent) => {

            const files = e.clipboardData?.files;

            if (!files || files.length === 0) return;

            const input = inputRef.current;
            if (!input) return;

            const dt = new DataTransfer();
            for (const file of Array.from(files)) dt.items.add(file);
            input.files = dt.files;

            input.dispatchEvent(new Event("change", { bubbles: true }));

        };

        document.addEventListener("paste", onPaste);
        return () => document.removeEventListener("paste", onPaste);

    }, []);

    if (!user) return null;

    return (

        <>

            <form action={updatePost} className={"flex flex-col gap-3 w-full items-center justify-center"}>

                <div className={"w-full"}>

                    { isPreview && <BoardPostPreview user={user} title={title} media={media} contents={content} spoiler={spoiler} /> }

                </div>

                <table className={`w-full max-w-100 border-separate border-spacing-[2px] ${isPreview ? "hidden" : ""}`}>

                    <tbody>

                        <tr>

                            <th className="w-25 bg-[#721C24] text-white text-left border border-black px-1">Post title</th>

                            <td colSpan={2}>
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

                            <td colSpan={2}>
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
                                        onChange={() => { setSpoiler(!spoiler); }}
                                    />

                                </label>

                            </td>

                        </tr>

                    </tbody>

                </table>

                <div className="flex flex-row items-center gap-1">

                    <input className={"hidden"} type={"text"} name={"board"} value={board} readOnly />
                    <input className={"hidden"} type={"number"} name={"postId"} value={editing.id} readOnly />

                    <Check action="editBoardPost" setFinished={setFinished} />

                    <button
                        className={`button-secondary${title.length > 3 && content.length >= 10 && media != "" ? "" : "-disabled"}`}
                        type="button"
                        onClick={() => {setIsPreview(!isPreview);}}
                        disabled={ title.length <= 3 && content.length < 10 && media == ""}
                    >
                        { isPreview ? "Edit" : "Preview" }
                    </button>

                    <button
                        className={`button-primary${finished && title.length > 3 && content.length >= 10 && media != "" ? "" : "-disabled"}`}
                        type={"submit"}
                        disabled={ !finished || title.length <= 3 && content.length < 10 && media == ""}
                    >
                        Edit
                    </button>

                    <Bubble description={"Requirements to post: \n- At least a 3 characters long title \n - At least a 10 characters long description \n - Some kind of media (must be an image)"} />

                </div>

            </form>

        </>

    )

}