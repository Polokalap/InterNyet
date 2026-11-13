import Image from "next/image";
import Link from "next/link";
import { getTrending, Post } from "@/app/lib/board";
import { readFile } from "node:fs/promises";
import path from "path";
import { getBoardByName } from "@/app/lib/messages";
import "./Boards.css";

const POSTS = 8;

export default async function Trending() {

    const col1 = await getTrending(0, POSTS / 2);
    const col2 = await getTrending(POSTS / 2, POSTS);

    if ("success" in col1 || "success" in col2) {

        return null;

    }

    return (

        <div className={"flex flex-col gap-1 w-full min-h-120 border-2 bg-[#FFF9F0]"}>

            <div className={"flex flex-row justify-between pl-1 pr-1 w-full border-b-1 bg-[#721C24] items-center"}>

                <p className={"text-white font-bold text-lg"}>Trending</p>

            </div>

            <div className={"flex flex-col gap-13 w-full h-full overflow-x-auto overflow-y-hidden bg-[#FFF9F0] justify-between text-sm p-5 pt-6"}>

                <div className={"flex flex-row justify-evenly"}>

                    {
                        col1.map((item, i) => (

                            <TrendingElement post={item} key={i} />

                        ))
                    }

                </div>

                <div className={"flex flex-row justify-evenly"}>

                    {
                        col2.map((item, i) => (

                            <TrendingElement post={item} key={i} />

                        ))
                    }

                </div>

            </div>

        </div>

    )

}

export async function TrendingElement({ post }: { post: Post }) {

    const raw = await readFile(path.join(post.path, "post.md"), "utf-8");

    const content = raw
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#>*_`~-]+/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 200);

    return (

        <div className={"flex flex-col gap-1 items-center justify-center text-center w-40 h-40"}>

            <p className={"text-[#721C24] font-bold"}>{ getBoardByName(post.board) }</p>

            <Link href={`/board/${post.board}/posts/${post.id}`} className={"!no-underline flex flex-col items-center text-center w-full"}>

                <div className={"relative w-[125px] h-[125px] shrink-0 border border-black"}>

                    <Image
                        src={`/api/post/${post.id}/media.avif`}
                        alt={"Post media"}
                        fill
                        sizes={"125px"}
                        className={"object-cover"}
                    />

                </div>

                <p className={"text-[#721C24] w-full line-clamp-3 h-[3.75rem] break-words"}>
                    <span className={"font-bold"}>{ post.title }: </span>
                    { content }
                </p>

            </Link>

        </div>

    )

}