import ToMarkdown from "@/app/components/markdown/Markdown";
import { Post } from "@/app/lib/board";
import { getAnon, getUser } from "@/app/lib/auth";
import { readFile } from "node:fs/promises";
import path from "path";
import PostImage from "./PostImage";

type Props = {
    post: Post;
}

export default async function BoardPost({ post }: Props) {

    let uploader = await getUser(post.account);
    if (!uploader) uploader = await getAnon();

    const content = await readFile(path.join(post.path, "post.md"), "utf-8");
    const buffer = await readFile(path.join(post.path, "media.jpg"));
    const media = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    return (

        <div className="flex flex-col gap-1">

            <div className="flex flex-row justify-between mb-1 items-center">

                <div className="flex flex-row gap-1 items-center">

                    <img src={`/api/account/${uploader.id}/profile.jpeg`} alt="Profile picture" className="border-1" width={30} />
                    <p className="font-bold" style={{ color: uploader.color }}>{uploader.display}</p>

                </div>

                <p className="text-inherit text-zinc-500">

                    {new Date(post.release * 1000).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}

                </p>

            </div>

            <div className="flex flex-col gap-2 bg-[#FFF9F0] border-1 w-full p-1 items-center">

                <h1 className="text-3xl font-bold">{post.title}</h1>

                <div className="flex flex-col gap-1 w-full pr-2 pl-2">
                    <PostImage src={media} />
                    <ToMarkdown text={content} />
                </div>

            </div>

        </div>

    )

}