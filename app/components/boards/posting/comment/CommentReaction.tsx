"use client"

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleLikeComment } from "@/app/board/actions";

type Props = {
    commentId: number;
    comments: number;
    likes: number;
    liked: boolean;
}

export default function CommentReaction({ commentId, comments, likes, liked }: Props) {

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

            <div className={"flex flex-row gap-1 items-center cursor-pointer"} onClick={handleLike}>

                <img src={`/assets/icons/${liked ? "liked.png" : "like.png"}`} alt={"Like"} className={"w-4 h-4"} />
                <p className={`${liked ? "text-[#C62828]" : ""}`}>{ likes }</p>

            </div>

            <div className={"flex flex-row gap-1 items-center"}>

                <img src="/assets/icons/comment.png" alt={"Comment"} className={"w-4 h-4"} />
                <p>{ comments }</p>

            </div>

        </div>

    )

}