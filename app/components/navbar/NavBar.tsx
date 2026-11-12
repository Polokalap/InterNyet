import NavLink from "@/app/components/navbar/NavLink";
import { getIfUser } from "@/app/lib/auth";
import "./NavBar.css";
import NavProfileDropdown from "@/app/components/user/NavProfileDropdown";

export default async function NavBar() {

    const user = await getIfUser();

    return (

        <div className={"navbar"}>

            <ul>

                <NavLink title={"Main"} path={"/"} />
                <NavLink title={"Rules"} path={"/rules"} />
                <NavLink title={"News"} path={"/news"} />

            </ul>

            <ul>

                { /* <NavLink title={"Inbox"} path={"/inbox"} /> */ }

                {user ? (

                    <NavProfileDropdown user={user} />

                ) : (

                    <NavLink title={"Account"} path={"/account"} />

                )}

            </ul>

        </div>

    )

}