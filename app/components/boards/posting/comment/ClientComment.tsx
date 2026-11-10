"use client"

import { PlainComment, User } from "@/app/lib/types";
import Link from "next/link";
import CommentContextMenu from "@/app/components/boards/posting/comment/CommentContextMenu";
import ToMarkdown from "@/app/components/markdown/Markdown";
import PostImage from "@/app/components/boards/posting/PostImage";
import CommentReaction from "@/app/components/boards/posting/comment/CommentReaction";
import { ReactNode, useState } from "react";
import CreateComment from "@/app/components/boards/posting/comment/CreateComment";


type Props = {
    user?: User | null;
    uploader: User;
    comment: PlainComment;
    isMod: boolean;
    hasMedia: boolean;
    isOwner: boolean;
    content: string;
    spoiler: boolean;
    media: string;
    liked: boolean;
    likes: number;
    small: boolean
    comments: PlainComment[];
    children?: ReactNode;
}

export default function ClientComment({ user, uploader, comment, isMod, hasMedia, isOwner, content, spoiler, media, liked, likes, small, comments, children }: Props) {

    const [commenting, setCommenting] = useState(false);
    const [open, setOpen] = useState(false);

    return (

        <>

            <div className={"pl-2"}>

                <div className={"flex flex-col gap-1 mt-5 min-w-50 max-w-110"}>

                    <div className={"flex flex-row gap-3 justify-between mb-1 items-center"}>

                        <Link
                            href={`/profile/${uploader ? `@${uploader.name}` : comment.account}`}
                            className={"flex flex-row gap-1 items-center"}
                            style={{ textDecoration: "none" }}
                        >

                            <img src={`/api/account/${uploader.id}/profile.jpeg`} alt="Profile picture" className="border-1 border-black" width={30} />
                            <p className="font-bold" style={{ color: uploader.color }}>{uploader.display}</p>

                        </Link>

                        <p className={"text-inherit text-zinc-500"}>{ new Date(comment.release * 1000).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) }</p>

                    </div>

                    <div className={"relative flex flex-col gap-2 bg-[#FFF9F0] border-1 min-w-50 max-w-110 p-1 pt-3 pb-3 items-center"}>

                        <CommentContextMenu
                            comment={comment}
                            canRemoveMedia={isMod && hasMedia}
                            canRemove={isOwner || isMod}
                        />

                        <div className={"flex flex-col gap-1 w-full pr-2 pl-2"}>

                            <ToMarkdown text={content} />
                            { hasMedia && <PostImage src={media} spoiler={spoiler} /> }

                            <CommentReaction
                                comments={comments.length}
                                commentId={comment.id}
                                liked={liked}
                                likes={likes}
                                small={small}
                                commenting={commenting}
                                setCommenting={setCommenting}
                            />

                        </div>

                    </div>

                </div>

                { children }

                <div className={"pl-0.5"}>

                    { commenting && (
                        user ?
                            <CreateComment user={user} id={comment.id}/>
                            :
                            <p className={"text-red-700 m-auto"}>You must have an account to comment!</p>
                        )
                    }

                </div>

            </div>

        </>

    )

}