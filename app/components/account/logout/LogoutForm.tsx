"use client"

import Check from "@/app/components/verification/Check";
import { useState } from "react";
import { logout } from "@/app/account/actions";


export default function LogoutForm() {

    const [finished, setFinished] = useState(false);

    return (

        <form action={logout}>

            <Check action={"logout"} setFinished={setFinished} />
            <button className={`button-primary${finished ? "" : "-disabled"} scale-125`} type={"submit"} disabled={!finished}>Yes, log out</button>

        </form>

    );

}