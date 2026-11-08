import ToMarkdown from "@/app/components/markdown/Markdown";
import { getAnon, getIfUser, getUser } from "@/app/lib/auth";
import { readFile } from "node:fs/promises";
import path from "path";
import {getIfCommentSpoiler, PostComment} from "@/app/lib/board";
import PostImage from "@/app/components/boards/posting/PostImage";
import { existsSync } from "node:fs";
import CommentContextMenu from "@/app/components/boards/posting/comment/CommentContextMenu";
import Link from "next/link";
import Palantir from "@/app/components/palantir/Palantir";

type Props = {
    comment: PostComment;
    edit?: boolean;
}

export default async function CommentPost({ comment, edit = false }: Props) {

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

    return (

        <>

            <Palantir />

            <div className={"flex flex-col gap-1 mt-5"}>

                <div className={"flex flex-row gap-3 justify-between mb-1 items-center w-110"}>

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

                    </div>

                </div>

            </div>

        </>

    )

}