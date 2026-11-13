"use client"

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeMedia, removePost } from "@/app/board/actions";

type Props = {
    board: string;
    postId: number;
    canEdit: boolean;
    canRemoveMedia: boolean;
    canRemove: boolean;
};

const itemClass = "hover:bg-[#721C24] hover:text-white hover:font-bold pl-1 cursor-pointer";

export default function ContextMenu({ board, postId, canEdit, canRemoveMedia, canRemove }: Props) {

    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const [copied, setCopied] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {

        if (!open) return;

        const onClick = (e: MouseEvent) => {

            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);

        };

        const onKey = (e: KeyboardEvent) => {

            if (e.key === "Escape") setOpen(false);

        };

        document.addEventListener("mousedown", onClick);
        document.addEventListener("keydown", onKey);

        return () => {
            document.removeEventListener("mousedown", onClick);
            document.removeEventListener("keydown", onKey);
        };

    }, [open]);

    const run = (action: () => Promise<unknown>, confirmText?: string, keepOpen = false) => {

        if (confirmText && !confirm(confirmText)) return;
        if (!keepOpen) setOpen(false);

        startTransition(async () => {

            await action();
            router.refresh();

        });

    };

    return (

        <div ref={ref} className={"absolute -top-2 right-1 select-none"}>

            <p
                className={"cursor-pointer p-1"}
                role="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen(o => !o)}
            >
                ...
            </p>

            { open && (

                <form role="menu" className={"absolute right-0 z-10 flex w-30 flex-col gap-1 border-1 p-1 bg-[#FFF9F0]"}>

                    <p role="menuitem"
                       className={itemClass}
                       onClick={() => run(async () => {

                           await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/board/${board}/posts/${postId}`);
                           setCopied(true);
                           setTimeout(() => setCopied(false), 2000)

                       }, undefined, true)}>
                        { copied ? "Link copied!" : "Share" }
                    </p>

                    { canEdit && (

                        <p role="menuitem" className={itemClass} onClick={() => { window.location.href = `/board/${board}/posts/${postId}/edit` }}>Edit</p>

                    )}

                    { canRemoveMedia && (

                        <p role="menuitem" className={itemClass}
                           onClick={() => run(() => removeMedia(postId))}>
                            Remove media
                        </p>

                    )}

                    { canRemove && (

                        <p role="menuitem" className={itemClass}
                           onClick={() => run(() => removePost(postId))}>
                            Remove
                        </p>

                    )}

                </form>

            )}

        </div>

    )

}