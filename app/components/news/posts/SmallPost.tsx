import ToMarkdown from "@/app/components/markdown/Markdown";
import Bubble from "@/app/components/bubble/Bubble";
import { getPost, Post } from "@/app/lib/news";
import { redirect } from "next/navigation";
import { getUser } from "@/app/lib/auth";
import { readFile } from "node:fs/promises";
import path from "path";

type Props = {
    id: string;
}

export default async function SmallPost({ id }: Props) {

    const post = await getPost(id);

    if (!(post instanceof Post)) {

        redirect("/news");

    }

    const poster = await getUser(post.account);

    if (!poster) {

        redirect("/news");

    }

    const release = new Date(post.release * 1000);
    const content = await readFile(path.join(post.path, "post.md"), "utf-8");

    return (

        <>

            <div className={"flex flex-col gap-1"}>

                <div className={"flex flex-row justify-between mb-1 items-center"}>

                    <div className={"flex flex-row gap-1 items-center"}>

                        <a style={{ textDecoration: "none" }} className={"flex flex-row gap-1 items-center"} href={`/news/author/${poster.id}`}>

                            <img src="/api/account/1/profile.jpeg" alt="Profile picture" className={"border-1"} width={30} />
                            <p className={`font-bold`} style={{ color: poster.color }}>{ poster.display }</p>

                        </a>

                        <Bubble description={"This user is an administrator"} />

                    </div>

                    <div>

                        <p className={"text-inherit text-zinc-500"}>{ release.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) }</p>

                    </div>

                </div>

                <div className={"flex flex-col gap-2 bg-[#FFF9F0] border-1 w-full p-1 items-center"}>

                    <h1 className={"text-3xl font-bold"}>{ post.title }</h1>

                    <div className={"flex flex-col gap-1 w-full pr-2 pl-2"}>

                        <ToMarkdown text={content} />

                    </div>

                </div>

            </div>

        </>

    )

}