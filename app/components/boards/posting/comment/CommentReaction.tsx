"use client"

import { useTransition } from "react";
import {redirect, useRouter} from "next/navigation";
import { toggleLikeComment } from "@/app/board/actions";
import {comment} from "postcss";

type Props = {
    commentId: number;
    comments: number;
    likes: number;
    liked: boolean;
    small: boolean;
    commenting: boolean;
    setCommenting: (commenting: boolean) => void;
}

export default function CommentReaction({ commentId, comments, likes, liked, small, commenting, setCommenting }: Props) {

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const handleLike = () => {

        if (pending) return;

        startTransition(async () => {

            await toggleLikeComment(commentId);
            router.refresh();

        });

    };

    return (

        <div className="flex flex-row gap-2">

            <div className={"flex flex-row gap-1 items-center cursor-pointer select-none"} onClick={handleLike}>

                <img src={`/assets/icons/${liked ? "liked.png" : "like.png"}`} alt={"Like"} className={"w-4 h-4"} />
                <p className={`${liked ? "text-[#C62828]" : ""}`}>{ likes }</p>

            </div>

            <div
                className={`flex flex-row gap-1 items-center select-none ${small ? "" : "cursor-pointer"}`}
                onClick={() => {

                    if (small) return;

                    setCommenting(!commenting);

                }}
            >

                <img src={`/assets/icons/${commenting ? "comment-open" : "comment"}.png`} alt={"Comment"} className={"w-4 h-4"} />
                <p className={`${commenting ? "text-[#C62828]" : ""}`}>{ comments }</p>

            </div>

        </div>

    )

}