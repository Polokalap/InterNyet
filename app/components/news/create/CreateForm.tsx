"use client"

import Check from "@/app/components/verification/Check";
import { useState } from "react";
import PostPreview from "@/app/components/news/posts/PostPreview";
import { createPost } from "@/app/news/actions";

export default function CreateForm({ user }: { user: { id: number; name: string; display: string; color: string; created: number; cooldowns: Record<string, number> } | null  }) {

    const [finished, setFinished] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    if (!user) return null;

    return (

        <>

            <form action={createPost} className={"flex flex-col gap-5 w-full"}>

                <input
                    type={"text"}
                    className={"input"}
                    name={"title"}
                    placeholder={"Post title"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div className={"flex flex-row gap-1 justify-end"}>

                    <button
                        className={"button-secondary"}
                        type={"button"}
                        onClick={() => setIsPreview(!isPreview)}
                    >
                        { isPreview ? "Edit" : "Preview" }
                    </button>

                </div>

                {

                    isPreview ?

                        (

                            <PostPreview title={title} contents={content} user={user} />

                        )

                        :

                        (

                            <textarea
                                className={"input min-h-100 max-h-200"}
                                name={"content"}
                                placeholder={"Text"}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />

                        )

                }

                <div className={"flex flex-row gap-1 justify-end pr-2 pl-2"}>

                    <Check action={"createPost"} setFinished={setFinished} />
                    <button
                        className={`button-primary${finished && user.cooldowns["createPost"] == undefined ? "" : "-disabled"} scale-125`}
                        type={"submit"}
                        disabled={!finished || user.cooldowns["createPost"] !== undefined}
                    >
                        Create post
                    </button>

                </div>

            </form>

        </>

    )

}