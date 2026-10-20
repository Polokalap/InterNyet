import boards from "@/public/boards.json";
import Link from "next/link";
import type { ReactNode } from "react";
import "./Boards.css";

type Props = {
    title: string;
}

const PER_COLUMN = 22;

export default function Boards({ title }: Props) {

    const columns: ReactNode[][] = [[]];

    for (const category of boards) {

        const header = (
            <div key={category.name} className={"flex flex-row gap-1"}>

                <p className={"category"}>{category.name}</p>
                <p className={"darker"}>({category.boards.length})</p>

            </div>
        );

        const items = category.boards.map((board) => (
            <p key={`${category.name}/${board.name}`} className={"zeroh"}>

                <Link href={`/board/${board.path}`}
                      className={"board"}>{board.name}</Link>

            </p>
        ));

        const size = 1 + items.length;
        let current = columns[columns.length - 1];
        const remaining = PER_COLUMN - current.length;

        const needsNewColumn = current.length > 0 && (size <= PER_COLUMN ? size > remaining : remaining < 2);

        if (needsNewColumn) {

            current = [];
            columns.push(current);

        }

        for (const el of [header, ...items]) {

            if (current.length >= PER_COLUMN) {

                current = [];
                columns.push(current);

            }

            current.push(el);

        }

    }

    return (

        <div className={"flex flex-col w-full h-100 border-2"}>

            <div className={"flex flex-row justify-between pl-1 pr-1 w-full border-b-1 bg-[#e89b68] items-center"}>

                <p className={"text-[#721C24] font-bold text-lg"}>{ title }</p>

            </div>

            <div className={"flex flex-row w-full h-full gap-1 p-1 bg-[#FFF9F0] text-sm"}>

                {columns.map((column, i) => (

                    <div key={i} className={"flex flex-col"}>

                        {column}

                    </div>

                ))}

            </div>

        </div>

    )

}