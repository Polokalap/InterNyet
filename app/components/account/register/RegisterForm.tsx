"use client"

import Check from "@/app/components/verification/Check";
import { getMessage } from "@/app/lib/messages";
import { useState } from "react";
import { register } from "@/app/account/actions";


export default function RegisterForm({ error, code }: {error: string | undefined, code: string | undefined}) {

    const [finished, setFinished] = useState(false);

    return (

        <form action={register} className="flex flex-col gap-5 items-center">

            <p className={"text-3xl"}>Register</p>

            <div className={"flex flex-col"}>

                <div className={"flex flex-col"}>

                    <p>Username:</p>
                    <input name={"user"} className={"input"} type="text" maxLength={16} />

                </div>

                <div className={"flex flex-col"}>

                    <p>Password:</p>
                    <input name={"password"} className={"input"} type="password" maxLength={128} />

                </div>

                <Check action={"register"} setFinished={setFinished} />

            </div>

            <button className={`button-primary${finished ? "" : "-disabled"} scale-125`} type={"submit"} disabled={!finished}>Register</button>

            <p>Already have an account? <a href="/account/login">log in!</a></p>

            {error && <p className="text-red-700">{getMessage(code) ?? "Invalid username or password"}</p>}

        </form>

    );

}