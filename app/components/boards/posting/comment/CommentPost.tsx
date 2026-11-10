import { getAnon, getIfUser, getUser } from "@/app/lib/auth";
import { readFile } from "node:fs/promises";
import path from "path";
import {
    getCommentsOnComment,
    getIfCommentSpoiler,
    getLikesOnComment,
    hasLikedComment
} from "@/app/lib/board";
import { existsSync } from "node:fs";
import Palantir from "@/app/components/palantir/Palantir";
import ClientComment from "@/app/components/boards/posting/comment/ClientComment";
import {PlainComment} from "@/app/lib/types";
import PostComments from "@/app/components/boards/posting/comment/PostComments";

type Props = {
    comment: PlainComment;
    small?: boolean;
}

export default async function CommentPost({ comment, small = false }: Props) {

    let uploader = await getUser(comment.account);
    const user = await getIfUser();
    if (!uploader) uploader = await getAnon();

    const isOwner = !!user && user.id == comment.account;
    const isMod = !!user && user.role > 0;

    const content = await readFile(path.join(comment.path, "post.md"), "utf-8");

    const hasMedia =
        existsSync(path.join(comment.path, "media")) ||
        existsSync(path.join(comment.path, "media.jpg"));
    const media = `/api/comment/${comment.id}/media.avif`;

    const spoiler = await getIfCommentSpoiler(comment.id);

    const comments = await getCommentsOnComment(comment.id);
    const likes = await getLikesOnComment(comment.id);
    const liked = !!user && hasLikedComment(comment.id, user.id);

    if (small && comment.account == -1) return null;

    return (

        <>

            <Palantir />

            <ClientComment
                user={user}
                comment={comment}
                isMod={isMod}
                hasMedia={hasMedia}
                likes={likes}
                liked={liked}
                comments={comments.map((reply) => ({ ...reply }))}
                spoiler={spoiler}
                isOwner={isOwner}
                content={content}
                media={media}
                uploader={uploader}
                small={small}
            >

                <div className={"md:pl-2 pl-1 w-110"}>

                    <PostComments limit={small ? 3 : -1} small={small}  comment={{ ...comment }} />

                </div>

            </ClientComment>

        </>

    )

}