"use client"

import { useState } from "react";

export default function PostImage({ src }: { src: string }) {

    const [fullImage, setFullImage] = useState(false);

    return (
        <img
            src={src}
            alt="Post media"
            className={`${fullImage ? "max-w-full" : "max-w-50"} max-h-96 border-1 self-start cursor-pointer`}
            onClick={() => setFullImage(!fullImage)}
        />
    );

}