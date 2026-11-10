"use client"

import { useState } from "react";
import Image from "next/image";

export default function PostImage({ src, spoiler = false }: { src: string, spoiler?: boolean }) {
    const [fullImage, setFullImage] = useState(false);

    return (
        <div className="overflow-clip w-fit max-w-full border-1">
            {
                fullImage ?
                    <img
                        src={src}
                        alt={"Post media"}
                        className={"max-h-128 min-h-45 self-start cursor-pointer"}
                        onClick={() => setFullImage(!fullImage)}
                    />
                    :
                <Image
                    src={src}
                    alt={"Post media"}
                    width={0}
                    height={0}
                    sizes={spoiler ? "12px" : "200px"}
                    style={{ width: "auto", height: "auto" }}
                    className={`max-w-50 self-start cursor-pointer ${spoiler ? "min-w-45 blur-lg" : ""}`}
                    onClick={() => setFullImage(!fullImage)}
                />
            }
        </div>
    );
}