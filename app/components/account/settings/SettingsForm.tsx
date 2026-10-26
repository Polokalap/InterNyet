"use client"

import { settings } from "@/app/account/actions";
import Check from "@/app/components/verification/Check";
import { useState } from "react";

export default function SettingsForm({ error, code, user }: { error: string | undefined, code: string | undefined, user: { id: number; name: string; display: string; created: number; } | null }) {

    const [finished, setFinished] = useState(false);

    if (!user) return null;

    return (

        <form className={"flex flex-col gap-3"} action={settings}>

            <h1 className={"text-3xl"}>Account settings</h1>

            <br />

            <div className={"flex flex-row justify-between"}>

                <p className={"text-lg"}>Profile picture:</p>

                <input className={"button"} name={"profile"} type="file" />

            </div>

            <div className={"flex flex-row justify-between"}>

                <p className={"text-lg"}>Display name:</p>

                <input className={"input"} name={"display"} type="text" defaultValue={user.display} placeholder={user.display} />

            </div>

            <div className={"flex flex-row justify-between pr-1.5"}>

                <br />

                <Check action={"settings"} setFinished={setFinished} />

                <button className={`button-primary${finished ? "" : "-disabled"} scale-125`} type={"submit"} disabled={!finished}>Save</button>

            </div>

        </form>

    );

}