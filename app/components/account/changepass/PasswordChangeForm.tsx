"use client"

import Check from "@/app/components/verification/Check";
import { useState } from "react";
import { changePassword } from "@/app/account/actions";

export default function PasswordChangeForm({ user }: { user: { id: number; name: string; display: string; created: number; cooldowns: Record<string, number> } | null  }) {

    const [finished, setFinished] = useState(false);

    if (!user) return null;

    return (

        <form action={changePassword} className={"flex flex-col gap-2 w-full justify-evenly p-20 pt-0 items-center"}>

            <input className={"input w-60"} name={"current-password"} type="password" placeholder={"Current password"} />
            <input className={"input w-60"} name={"new-password"} type="password" placeholder={"New password"} />

            <div className={"flex flex-row w-full justify-evenly mt-3"}>

                <button
                    className={`button-primary${finished && user.cooldowns["passwordChange"] == undefined ? "" : "-disabled"} scale-125`}
                    type={"submit"}
                    disabled={!finished || user.cooldowns["passwordChange"] !== undefined}
                >
                    Yes, delete
                </button>

                <Check action={"changePassword"} setFinished={setFinished} />
                <a href={"/account"}><button className={"button-secondary scale-125"}>Go back</button></a>

            </div>

        </form>

    );

}