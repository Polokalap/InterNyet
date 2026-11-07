"use client"

import { useState } from "react";

export default function PostImage({ src, spoiler }: { src: string, spoiler: boolean }) {

    const [fullImage, setFullImage] = useState(false);

    return (
        <div className="overflow-clip w-fit max-w-full border-1">
            <img
                src={src}
                alt={"Post media"}
                className={`${fullImage ? "max-w-full" : "max-w-50"} max-h-96 self-start cursor-pointer ${spoiler && !fullImage ? "blur-sm" : ""}`}
                onClick={() => setFullImage(!fullImage)}
            />
        </div>
    );

}