import NavLink from "@/app/components/navbar/NavLink";
import { getIfUser } from "@/app/lib/auth";
import "./NavBar.css";
import NavProfileDropdown from "@/app/components/user/NavProfileDropdown";
import Link from "next/link";
import { isNewInteraction } from "@/app/lib/board";

export default async function NavBar() {

    const user = await getIfUser();
    const isNotif = await isNewInteraction(user != null ? user.id : -1);

    return (

        <div className={"navbar"}>

            <ul>

                <NavLink title={"Main"} path={"/"} />
                <NavLink title={"Rules"} path={"/rules"} />
                <NavLink title={"News"} path={"/news"} />

            </ul>

            <ul>

                {user ? (

                    <>

                        <Link
                            href={"/inbox"}
                            className={`old-menu${isNotif ? "-green" : ""} hover:old-menu${isNotif ? "-green" : ""}-hover flex flex-row items-center justify-center w-9 cursor-pointer`}
                        >

                            <img
                                src={"/assets/icons/inbox.png"}
                                alt={"Inbox"}
                                width={20}
                                height={20}
                            />

                        </Link>

                        <NavProfileDropdown user={user} />

                    </>

                ) : (

                    <>

                        <NavLink title={"Donate"} path={"/donate"} />
                        <NavLink title={"Account"} path={"/account"} />

                    </>

                )}

            </ul>

        </div>

    )

}