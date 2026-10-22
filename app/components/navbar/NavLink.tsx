"use client"

import { usePathname } from "next/navigation";
import Link from "next/link";
import "./NavBar.css";

type Props = {
    path: string;
    title: string;
}

export default function NavLink({ path, title }: Props) {

    const pathname = usePathname();

    return (
        <Link className={pathname.toLowerCase().endsWith(path) ? "active" : ""} href={path}><li>{ title }</li></Link>
    )

}