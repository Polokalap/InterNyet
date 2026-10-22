import "./NavBar.css";
import NavLink from "@/app/components/navbar/NavLink";

export default function NavBar() {

    return (

        <div className={"navbar"}>

            <ul>

                <NavLink title={"Main"} path={"/"} />
                <NavLink title={"Rules"} path={"/rules"} />
                <NavLink title={"FAQ"} path={"/faq"} />

            </ul>

            <ul>

                <NavLink title={"Donate"} path={"/donate"} />
                <NavLink title={"Account"} path={"/account"} />

            </ul>

        </div>

    )

}