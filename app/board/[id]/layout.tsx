import type { Metadata } from "next";
import { getBoardByName, getBoardDescription } from "@/app/lib/messages";

export async function generateMetadata({
  params,
}: LayoutProps<"/board/[id]">): Promise<Metadata> {

  const { id } = await params;

  const name = getBoardByName(id);
  const description = getBoardDescription(id);

  return {
    title: `${name} at InterNyet`,
    description: `${name}: ${description}`,
    openGraph: {
      title: `${name} at InterNyet`
    },
  };
}

export default function Layout({ children }: LayoutProps<"/board/[id]">) {
  return <>{children}</>;
}