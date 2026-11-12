import ToMarkdown from "@/app/components/markdown/Markdown";
import { getAllComments, getComments, getIfSpoiler, getPostLikeCount, hasLikedPost, Post } from "@/app/lib/board";
import { getAnon, getIfUser, getUser } from "@/app/lib/auth";
import { readFile } from "node:fs/promises";
import path from "path";
import PostImage from "./PostImage";
import ContextMenu from "@/app/components/boards/posting/ContextMenu";
import CreateComment from "@/app/components/boards/posting/comment/CreateComment";
import PostComments from "@/app/components/boards/posting/comment/PostComments";
import Link from "next/link";
import PostReaction from "@/app/components/boards/posting/PostReaction";

type Props = {
    post: Post;
    edit?: boolean;
    small?: boolean;
}

export default async function BoardPost({ post, edit = false, small = true }: Props) {

    let uploader = await getUser(post.account);
    const user = await getIfUser();
    if (!uploader) uploader = await getAnon();

    const isOwner = !!user && user.id == post.account;
    const isMod = !!user && user.role > 0;

    const content = await readFile(path.join(post.path, "post.md"), "utf-8");
    const media = `/api/post/${post.id}/media.avif`;
    const spoiler = await getIfSpoiler(post.id);

    const comments = await getComments(post.id);
    const allComments = await getAllComments(post.id);
    const likes = getPostLikeCount(post.id);
    const liked = !!user && hasLikedPost(post.id, user.id);

    return (

        <div className="flex flex-col gap-1">

            <div className="flex flex-row justify-between mb-1 items-center">

                <Link
                    href={`/profile/${uploader ? `@${uploader.name}` : post.account}`}
                    className={"flex flex-row gap-1 items-center"}
                    style={{ textDecoration: "none" }}
                >

                    <img src={`/api/account/${uploader.id}/profile.jpeg`} alt="Profile picture" className="border-1 border-black" width={30} />
                    <p className="font-bold" style={{ color: uploader.color }}>{uploader.display}</p>

                </Link>

                <p className="text-inherit text-zinc-500">

                    {new Date(post.release * 1000).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}

                </p>

            </div>

            <div className={"relative flex flex-col gap-2 bg-[#FFF9F0] border-1 p-1 items-center"}>

                <ContextMenu
                    board={post.board}
                    postId={post.id}
                    canEdit={isOwner && !edit}
                    canRemoveMedia={isMod}
                    canRemove={isOwner || isMod}
                />

                <Link
                    className={"text-3xl font-bold"}
                    href={`/board/${post.board}/posts/${post.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                >
                    {post.title}
                </Link>

                <div className="flex flex-col gap-1 w-full pr-2 pl-2">

                    <PostImage src={media} spoiler={spoiler} />

                    <ToMarkdown text={content} />

                    <PostReaction
                        postId={post.id}
                        board={post.board}
                        comments={allComments.length}
                        liked={liked}
                        likes={likes}
                        small={small}
                    />

                </div>

            </div>

            <div className={"md:ml-2 w-full md:overflow-clip overflow-auto"}>

                <PostComments post={post} small={small} limit={small ? 3 : -1} />

            </div>

            { user && !small && <CreateComment board={post.board} postId={post.id} user={user} /> }

        </div>

    )

}