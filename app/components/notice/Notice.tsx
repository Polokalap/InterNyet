"use client"

import {useEffect, useState} from "react";
import ToMarkdown from "@/app/components/markdown/Markdown";

type ManualProps = {
    title: string;
    message: string;
    id?: string;
    canHide?: boolean;
    onClose?: () => void;
}

type FileProps = {
    title: string;
    file: string;
    id?: string;
    canHide?: boolean;
    onClose?: () => void;
}

export default function Notice({ title, message, id, canHide = true, onClose }: ManualProps) {

    const [close, setClose] = useState(false);

    if (close) return null;

    const handleClose = () => {

        setClose(true);
        onClose?.();

    };

    return (

        <>

            <div className={"flex flex-col w-full border-2"} id={id}>

                <div className={"flex flex-row justify-between pl-1 pr-1 w-full border-b-1 bg-[#721C24] items-center"}>

                    <p className={"text-white font-bold text-lg"}>{ title }</p>

                    {canHide && <div className={"relative h-5 w-5 text-xl border-white border-1 cursor-pointer"} onClick={handleClose}>

                        <span className={"absolute bottom-1/2 right-1/2 translate-1/2 text-white font-mono font-bold"}>x</span>

                    </div>}

                </div>

                <div className={"p-1 bg-[#FFF9F0]"}>

                    <ToMarkdown text={message} />

                </div>

            </div>

        </>

    )

}

export function FileNotice({ title, file, id, canHide = true, onClose }: FileProps) {

    const [close, setClose] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {

        fetch(file)
            .then((res) => res.text())
            .then(setMessage);

    }, []);

    if (close) return null;
    if (!message) return null;

    const handleClose = () => {

        setClose(true);
        onClose?.();

    };

    return (

        <>

            <div className={"flex flex-col w-full border-2"} id={id}>

                <div className={"flex flex-row justify-between pl-1 pr-1 w-full border-b-1 bg-[#721C24] items-center"}>

                    <p className={"text-white font-bold text-lg"}>{ title }</p>

                    {canHide && <div className={"relative h-5 w-5 text-xl border-white border-1 cursor-pointer"} onClick={handleClose}>

                        <span className={"absolute bottom-1/2 right-1/2 translate-1/2 text-white font-mono font-bold"}>x</span>

                    </div>}

                </div>

                <div className={"p-1 bg-[#FFF9F0]"}>

                    <ToMarkdown text={message} />

                </div>

            </div>

        </>

    )

}