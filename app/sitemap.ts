import { MetadataRoute } from "next";
import boards from "@/public/boards.json";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {

    const boardUrls = boards.flatMap((category) =>
        category.boards.map((board) => ({
            url: `${baseUrl}/board/${board.id}`,
            changeFrequency: 'daily' as const,
            priority: 0.7,
        }))
    );

    return [
        {
            url: baseUrl,
            changeFrequency: 'daily',
            priority: 1
        },
        ...boardUrls,
    ]

}