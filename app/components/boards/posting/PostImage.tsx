"use client"

import { useState } from "react";
import Image from "next/image";

export default function PostImage({ src, spoiler = false }: { src: string, spoiler?: boolean }) {
    const [fullImage, setFullImage] = useState(false);

    return (
        <div className="overflow-clip w-fit max-w-full border-1">
            <Image
                src={src}
                alt="Post media"
                width={0}
                height={0}
                sizes={fullImage ? "100vw" : "200px"}
                style={{ width: "auto", height: "auto" }}
                className={`${fullImage ? "max-w-full" : "max-w-50"} max-h-96 self-start cursor-pointer ${spoiler && !fullImage ? "blur-lg" : ""}`}
                onClick={() => setFullImage(!fullImage)}
            />
        </div>
    );
}