import type { Metadata } from "next";
import {getIfSpoiler, getPostById, Post} from "@/app/lib/board";
import { getUser } from "@/app/lib/auth";
import {readFile} from "node:fs/promises";
import path from "path";

export async function generateMetadata({
  params,
}: LayoutProps<"/board/[id]/posts/[postId]">): Promise<Metadata> {
  const { id, postId } = await params;
  const post = await getPostById(postId);

  if (!post || !(post instanceof Post)) {

    return { title: "Post not found" };

  }

  const user = await getUser(post.account);

  if (!user) {

    return { title: "Post not found" };

  }

  const content = await readFile(path.join(post.path, "post.md"), "utf-8");

  if (!content) {

    return { title: "Post not found" };

  }

  const spoiler = await getIfSpoiler(post.id);

  return {
    title: `${post.title} at InterNyet`,
    description: `Check out this post made by ${user.display}\n\n` +
    `${content}`,
    openGraph: {
      title: `${post.title}`,
      images: spoiler ? `/api/post/${post.id}/media.avif}` : ``,
    },
  };
}

export default function Layout({ children }: LayoutProps<"/profile/[id]">) {
  return <>{children}</>;
}