"use client"

import Check from "@/app/components/verification/Check";
import { useState } from "react";
import { deleteAccount } from "@/app/account/actions";

export default function DeleteForm() {

    const [finished, setFinished] = useState(false);

    return (

        <form action={deleteAccount} className={"flex flex-col gap-5 w-full justify-evenly p-20 pt-0 items-center"}>

            <input className={"input w-60"} name={"password"} type="password" placeholder={"Password"} />

            <div className={"flex flex-row w-full justify-evenly"}>

                <button className={`button-primary${finished ? "" : "-disabled"} scale-125`} type={"submit"} disabled={!finished}>Yes, delete</button>
                <Check action={"deleteAccount"} setFinished={setFinished} />
                <a href={"/account"}><button className={"button-secondary scale-125"}>Go back</button></a>

            </div>

        </form>

    );

}