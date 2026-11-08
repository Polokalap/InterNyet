import type { Metadata } from "next";
import { getPostById, Post } from "@/app/lib/board";
import { getUser } from "@/app/lib/auth";

export async function generateMetadata({
  params,
}: LayoutProps<"/profile/[id]">): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post || !(post instanceof Post)) {

    return { title: "Post not found" };

  }

  const user = await getUser(post.account);

  if (!user) {

    return { title: "Post not found" };

  }

  return {
    title: `${post.title} at InterNyet`,
    description: `Check out this post made by ${user.display}`,
    openGraph: {
      title: `${post.title}`,
      images: `/api/post/${post.id}/profile.jpeg`,
    },
  };
}

export default function Layout({ children }: LayoutProps<"/profile/[id]">) {
  return <>{children}</>;
}