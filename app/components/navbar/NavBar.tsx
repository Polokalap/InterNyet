import Link from "next/link";
import "./NavBar.css";

export default function NavBar() {

    return (

        <div className={"navbar"}>

            <ul>

                <Link href={"/posts"}><li>Posts</li></Link>
                <Link href={"/rules"}><li>Rules</li></Link>
                <Link href={"/faq"}><li>FAQ</li></Link>

            </ul>

            <ul>

                <Link href={"/account"}><li>Account</li></Link>

            </ul>

        </div>

    )

}