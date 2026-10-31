"use client"

import Link from "next/link";

type Props = {
    page: number;
    totalPages: number;
}

export default function PageNavigator({ page, totalPages }: Props) {

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (

        <>

            <div className={"flex flex-row justify-center w-full"}>

                <div className={"flex flex-row gap-0.5"}>

                    {pages.map((p) => (

                        <Link
                            key={p}
                            href={`?page=${p}`}
                            className={p === page ? "font-bold underline" : ""}
                        >
                            {p}
                        </Link>

                    ))}

                </div>

            </div>

        </>

    )

}