"use client"

import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import remarkBreaks from "remark-breaks";
import { useEffect, useState } from "react";
import "./Markdown.css";

type Props = {
    path: string;
}

export default function FileMarkdown({ path }: Props) {

    const [content, setContent] = useState("");

    useEffect(() => {

        let cancelled = false;

        fetch(path)
            .then((res) => {
                if (!res.ok) return "";
                return res.text();
            })
            .then((text) => {
                if (!cancelled) setContent(text.trim());
            })
            .catch(() => {
                if (!cancelled) setContent("");
            });

        return () => { cancelled = true; };

    }, []);

    return (

        <div className={"markdown"}>

            <Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>{ content }</Markdown>

        </div>

    )

}