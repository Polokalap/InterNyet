import type { Metadata } from "next";
import { getBoardByName, getBoardDescription } from "@/app/lib/messages";
import {getRandomCover} from "@/app/lib/board";

export async function generateMetadata({
  params,
}: LayoutProps<"/board/[id]">): Promise<Metadata> {

  const { id } = await params;

  const name = getBoardByName(id);
  const description = getBoardDescription(id);
  const image = await getRandomCover(id);

  return {
    title: `/${id.toLowerCase()}/ at InterNyet`,
    description: `${name}: ${description}`,
    openGraph: {
      title: `${name} at InterNyet`,
      images: [image]
    },
  };
}

export default function Layout({ children }: LayoutProps<"/board/[id]">) {
  return <>{children}</>;
}