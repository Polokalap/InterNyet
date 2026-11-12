"use client"

import Check from "@/app/components/verification/Check";
import { useState } from "react";
import { User } from "@/app/lib/types";
import { toggleFollow } from "@/app/profile/action";

export default function FollowForm({ user, viewer, following }: { user: User, viewer?: User, following: boolean }) {

    const [finished, setFinished] = useState(false);

    return (

        <form action={toggleFollow}>

            <Check action={"follow"} setFinished={setFinished} />

            <input type={"hidden"} value={user.id} name={"user"} />

            <button
                className={`button-${viewer && finished ? (following ? "secondary" : "follow") : "primary-disabled"}`}
                type={"submit"}
                onClick={(e) => {
                    if (!viewer) {

                        e.preventDefault();
                        window.location.href = "/login";

                    }
                }}
                disabled={!finished}
            >

                { following ? "Following" : "Follow" }

            </button>

        </form>

    );

}