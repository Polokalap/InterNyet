import type { Metadata } from "next";
import { loadUser } from "@/app/lib/auth";
import {getFollowers} from "@/app/lib/profile";

export async function generateMetadata({
  params,
}: LayoutProps<"/profile/[id]">): Promise<Metadata> {
  const { id } = await params;
  const user = await loadUser(id);

  if (!user) return { title: "InterNyet User not found" };

  const followers = await getFollowers(user.id);

  return {
    title: `${user.display}'s profile`,
    description: `Check out ${user.display}'s profile${user.bio ? `\n\n"${user.bio}"` : `\n${followers} Followers`}`,
    openGraph: {
      title: `${user.display}'s profile`,
      images: `/api/account/${user.id}/profile.jpeg`,
    },
  };
}

export default function Layout({ children }: LayoutProps<"/profile/[id]">) {
  return <>{children}</>;
}