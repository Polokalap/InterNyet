"use client"

import { settings } from "@/app/account/actions";
import Check from "@/app/components/verification/Check";
import { useState } from "react";
import Bubble from "@/app/components/bubble/Bubble";
import {HexColorPicker} from "react-colorful";

export default function SettingsForm({ user }: { user: { id: number; name: string; display: string; color: string; created: number; cooldowns: Record<string, number>; role: number; } | null }) {

    const [finished, setFinished] = useState(false);
    const [color, setColor] = useState(user?.color ?? "#000000");

    if (!user) return null;

    return (

        <form className={"flex flex-col gap-3"} action={settings}>

            <h1 className={"text-3xl"}>Profile settings</h1>

            <br />

            <div className={"flex flex-row justify-between"}>

                <p className={"text-lg"}>Profile picture:</p>

                <input className={"button-secondary w-46"} name={"profile"} type="file" />

            </div>

            <div className={"flex flex-row justify-between"}>

                <p className={"text-lg"}>Display name:</p>

                <input className={"input"} name={"display"} type="text" defaultValue={user.display} placeholder={user.display} />

            </div>

            {

                user.role > 0 ? (

                <div className={"flex flex-row justify-between"}>

                    <p className={"text-lg"}>Name color:</p>

                    <div className={"flex flex-row gap-2"}>

                        <Bubble description={"You can only set your name color if you are an admin!"} />

                        <HexColorPicker className={"color-picker"} color={color} onChange={setColor} />
                        <input type={"hidden"} name={"color"} value={color} />

                    </div>

                </div>

                ) : null

            }

            <h1 className={"text-3xl"}>Account settings</h1>

            <br />

            <div className={"flex flex-row justify-between"}>

                <p className={"text-lg"}>Change username:</p>

                <div className={"flex flex-row gap-2"}>

                    <Bubble description={"You can only change your username every 7 days"} />

                    <input
                        className={`input${user.cooldowns["namechange"] !== undefined ? "-disabled" : ""}`}
                        name="username"
                        type="text"
                        defaultValue={user.name}
                        placeholder={user.name}
                        disabled={user.cooldowns["namechange"] !== undefined}
                    />

                </div>

            </div>

            <div className={"flex flex-row justify-between"}>

                <p className={"text-lg"}>Change password:</p>

                <div className={"flex flex-row gap-2"}>

                    <Bubble description={"You can only change your password every 7 days"} />

                    <button
                        className={`button-secondary${user.cooldowns["passwordChange"] !== undefined ? "-disabled" : ""}`}
                        onClick={() => window.location.href = "/account/changepass"}
                        disabled={user.cooldowns["passwordChange"] !== undefined}
                    >
                        Change password
                    </button>

                </div>

            </div>

            <h1 className={"text-3xl text-[#721C24]"}>Danger zone</h1>

            <br />

            <div className={"flex flex-row justify-between"}>

                <p className={"text-lg"}>Log out:</p>

                <button className="button-primary" onClick={() => window.location.href = "/account/logout"}>Log out</button>

            </div>

            <div className={"flex flex-row justify-between"}>

                <p className={"text-lg"}>Delete account:</p>

                <button className="button-primary" onClick={() => window.location.href = "/account/delete"}>Delete account</button>

            </div>

            <div className={"flex flex-row justify-between pr-1.5 mt-10"}>

                <Check action={"settings"} setFinished={setFinished} />

                <div className={"flex flex-row gap-7"}>

                    <button className="button-secondary scale-125" onClick={() => window.location.href = "/account"}>Revert changes</button>
                    <button className={`button-primary${finished ? "" : "-disabled"} scale-125`} type={"submit"} disabled={!finished}>Save</button>

                </div>

            </div>

        </form>

    );

}