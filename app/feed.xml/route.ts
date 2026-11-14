import {getBoardById, getIfSpoiler, getTrending, Post} from "@/app/lib/board";
import { Feed } from "feed";
import {readFile} from "node:fs/promises";
import path from "path";

export const dynamic = "force-static";
export const revalidate = 1800;

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

function toExcerpt(markdown: string, max = 280): string {

    const text = markdown
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[#>*_`~]+/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (text.length <= max) return text;

    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");

    return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}...`;

}

export async function GET() {

    const trending = await getTrending(0, 30);
    const posts: Post[] = "success" in trending ? [] : trending;

    const updated = posts.length
        ? new Date(Math.max(...posts.map((post) => post.release)) * 1000)
        : new Date();

    const feed = new Feed({
        title: "Trending InterNyet posts",
        description: "Latest trending posts from InterNyet",
        id: baseUrl,
        link: baseUrl,
        language: "en",
        updated,
        feedLinks: { rss2: `${baseUrl}/feed.xml` },
        copyright: "All user generated content is dedicated to the public domain.",
        favicon: `${baseUrl}/favicon.ico`,
        ttl: 30,
    });

    for (const post of posts) {

        if (await getIfSpoiler(post.id)) continue;

        let markdown: string;

        try {

            markdown = await readFile(path.join(post.path, "post.md"), "utf-8");

        } catch {

            continue;

        }

        const link = `${baseUrl}/board/${post.board}/posts/${post.id}`;
        const excerpt = toExcerpt(markdown);
        const date = new Date(post.release * 1000);
        const board = getBoardById(post.board);

        feed.addItem({
            title: post.title,
            id: link,
            link,
            description: excerpt,
            content: excerpt,
            date,
            published: date,
            category: board ? [{ name: board.name }] : undefined,
        });

    }

    return new Response(feed.rss2(), {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
        }
    });

}