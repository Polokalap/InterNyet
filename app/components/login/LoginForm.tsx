"use client"

import { login } from "@/app/account/actions";
import Check from "@/app/components/verification/Check";
import { getMessage } from "@/app/lib/messages";
import { useState } from "react";

export default function LoginForm({ error, code }: {error: string | undefined, code: string | undefined}) {

    const [finished, setFinished] = useState(false);

    return (

        <form action={login} className="flex flex-col gap-5 items-center">

            <p className={"text-3xl"}>Log in</p>

            <div className={"flex flex-col"}>

                <div className={"flex flex-col"}>

                    <p>Username:</p>
                    <input name={"user"} className={"input"} type="text" maxLength={16} />

                </div>

                <div className={"flex flex-col"}>

                    <p>Password:</p>
                    <input name={"password"} className={"input"} type="password" maxLength={128} />

                </div>

                <Check action={"login"} setFinished={setFinished} />

            </div>

            <button className={`button-primary${finished ? "" : "-disabled"} scale-125`} type={"submit"} disabled={!finished}>Log in</button>

            <p>Don't have an account yet? <a href="/account/register">register!</a></p>

            {error && <p className="text-red-700">{getMessage(code) ?? "Invalid username or password"}</p>}

        </form>

    );

}