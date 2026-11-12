"use client"

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleLike } from "@/app/board/actions";

type Props = {
    postId: number;
    board: string;
    comments: number;
    likes: number;
    liked: boolean;
    small?: boolean;
}

export default function PostReaction({ postId, board, comments, likes, liked, small = true }: Props) {

    const [pending, startTransition] = useTransition();
    const router = useRouter();

    const handleLike = () => {

        if (pending) return;

        startTransition(async () => {

            await toggleLike(postId);
            router.refresh();

        });

    };

    return (

        <div className="flex flex-row gap-2">

            <div className={"flex flex-row gap-1 items-center cursor-pointer"} onClick={handleLike}>

                <img src={`/assets/icons/${liked ? "liked.png" : "like.png"}`} alt={"Like"} className={"w-4 h-4"} />
                <p className={`${liked ? "text-[#C62828]" : ""}`}>{ likes }</p>

            </div>

            <div
                className={`flex flex-row gap-1 items-center select-none ${small ? "cursor-pointer" : ""}`}
                onClick={() => {

                    if (!small) return;

                    window.location.href = `/board/${board}/posts/${postId}`

                }}
            >

                <img src="/assets/icons/comment.png" alt={"Comment"} className={"w-4 h-4"} />
                <p>{ comments }</p>

            </div>

        </div>

    )

}