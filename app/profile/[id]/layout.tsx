import type { Metadata } from "next";
import { loadUser } from "@/app/lib/auth";

export async function generateMetadata({
  params,
}: LayoutProps<"/profile/[id]">): Promise<Metadata> {
  const { id } = await params;
  const user = await loadUser(id);

  if (!user) return { title: "InterNyet User not found" };

  return {
    title: `${user.display}'s profile`,
    description: `Check out ${user.display}'s profile`,
    openGraph: {
      title: `${user.display}'s profile`,
      images: `https://${process.env.HOSTNAME}/api/account/${user.id}/profile.jpeg`,
    },
  };
}

export default function Layout({ children }: LayoutProps<"/profile/[id]">) {
  return <>{children}</>;
}