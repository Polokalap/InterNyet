"use client"

import { User } from "@/app/lib/types";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Props = {
    user: User;
}

export default function NavProfileDropdown({ user }: Props) {

    const menuRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);

    // eslint-disable-next-line react-hooks/purity
    const epoch = Date.now();

    useEffect(() => {

        if (!open) return;

        const handleClickOutside = (event: MouseEvent) => {

            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {

                setOpen(false);

            }

        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [open]);

    return (

        <div
            className={"flex flex-col relative"}
            ref={menuRef}
        >

            <div
                className={"old-menu cursor-pointer"}
                onClick={() => setOpen(!open)}
                ref={menuRef}
            >

                <li className={"flex flex-row gap-1 items-center h-full"}>

                    <div className={"flex flex-row items-center h-full pr-1 border-r border-black"}>

                        <img
                            src={"/assets/icons/arrow.png"}
                            alt={"arrow"}
                            className={`${open ? "rotate-180" : ""} select-none`}
                            width={12}
                        />

                    </div>

                    <div>

                        <img
                            src={`/api/account/${user.id}/profile.jpeg?t=${epoch}`}
                            alt={"Your profile picture"}
                            className={"border border-black select-none"}
                            width={26}
                            height={26}
                        />

                    </div>

                </li>

            </div>

            {

                open ? (

                    <div className={"old-menu-red flex flex-col gap-1 min-w-30 absolute top-8.5 z-201 right-0"}>

                        <Link href={`/profile/@${user.name}`} className={"flex flex-row gap-2 items-center"} style={{ textDecoration: "none" }}>

                            <img
                                src={"/assets/icons/account.png"}
                                alt={"Profile"}
                                width={16}
                                height={16}
                            />

                            <p className={"text-white hover:font-bold"}>Profile</p>

                        </Link>

                        <Link href={"/account"} className={"flex flex-row gap-2 items-center"} style={{ textDecoration: "none" }}>

                            <img
                                src={"/assets/icons/setting.png"}
                                alt={"Settings"}
                                width={16}
                                height={16}
                            />

                            <p className={"text-white hover:font-bold"}>Settings</p>

                        </Link>

                        <Link href={"/donate"} className={"flex flex-row gap-2 items-center"} style={{ textDecoration: "none" }}>

                            <img
                                src={"/assets/icons/donate.png"}
                                alt={"Donate"}
                                width={16}
                                height={16}
                            />

                            <p className={"text-white hover:font-bold"}>Donate</p>

                        </Link>

                        <Link href={"/logout"} className={"flex flex-row gap-2 items-center"} style={{ textDecoration: "none" }}>

                            <img
                                src={"/assets/icons/logout.png"}
                                alt={"Log out"}
                                width={16}
                                height={16}
                            />

                            <p className={"text-white hover:font-bold"}>Log out</p>

                        </Link>

                    </div>

                ) : null

            }

        </div>

    )

}