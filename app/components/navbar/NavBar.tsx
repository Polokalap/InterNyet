import NavLink from "@/app/components/navbar/NavLink";
import { getIfUser } from "@/app/lib/auth";
import Link from "next/link";
import "./NavBar.css";

export default async function NavBar() {

    const user = await getIfUser();
    // eslint-disable-next-line react-hooks/purity
    const epoch = Date.now();

    return (

        <div className={"navbar"}>

            <ul>

                <NavLink title={"Main"} path={"/"} />
                <NavLink title={"Rules"} path={"/rules"} />
                <NavLink title={"FAQ"} path={"/faq"} />

            </ul>

            <ul>

                <NavLink title={"Donate"} path={"/donate"} />

                {user ? (

                    <li>

                        <Link className="flex flex-row gap-1 items-center" href="/account">

                            <img
                                src={`/api/account/${user.id}/profile.jpeg?t=${epoch}`}
                                alt="Your profile picture"
                                className="border border-black"
                                width={26}
                                height={26}
                            />

                            <p>{user.display}</p>

                        </Link>

                    </li>

                ) : (

                    <NavLink title="Account" path="/account" />

                )}

            </ul>

        </div>

    )

}