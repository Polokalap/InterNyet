"use client"

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeComment, removeCommentMedia } from "@/app/board/actions";
import type { PostComment } from "@/app/lib/board";

type Props = {
    comment: PostComment;
    canRemoveMedia: boolean;
    canRemove: boolean;
};

const itemClass = "hover:bg-[#721C24] hover:text-white hover:font-bold pl-1 cursor-pointer";

export default function CommentContextMenu({ comment, canRemoveMedia, canRemove }: Props) {

    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
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

    if (!canRemoveMedia && !canRemove) return null;

    const run = (action: () => Promise<unknown>, confirmText?: string) => {

        if (confirmText && !confirm(confirmText)) return;
        setOpen(false);

        startTransition(async () => {

            await action();
            router.refresh();

        });

    };

    if (!comment) return null;
    if ("success" in comment) return null;

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

                    { canRemoveMedia && (

                        <p role="menuitem" className={itemClass}
                           onClick={() => run(() => removeCommentMedia(comment.id))}>
                            Remove media
                        </p>

                    )}

                    { canRemove && (

                        <p role="menuitem" className={itemClass}
                           onClick={() => run(() => removeComment(comment.id))}>
                            Remove
                        </p>

                    )}

                </form>

            )}

        </div>

    )

}