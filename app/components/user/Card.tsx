import { User } from "@/app/lib/types";
import { getIfUser } from "@/app/lib/auth";
import { getClout, getFollowers, isFollowing } from "@/app/lib/profile";
import FollowForm from "@/app/components/account/follow/FollowForm";

type Props = {
    user: User;
    self?: boolean;
}

export default async function Card({ user, self = false }: Props) {

    const viewer = await getIfUser()
    const following = viewer ? await isFollowing(viewer.id, user.id) : false;
    const followers = await getFollowers(user.id);
    const clout = await getClout(user.id);

    // eslint-disable-next-line react-hooks/purity
    const epoch = Date.now();
    const date = new Date(user.created * 1000);

    if (self || !viewer) {

        return (

            <div className={"flex flex-row gap-2"}>

                <img src={`/api/account/${user.id}/profile.jpeg?t=${epoch}`} alt={"pfp"}
                     className={"border-1 border-black"} width={128} height={128}/>

                <div>

                    <p className={"flex flex-row gap-2 items-center text-2xl"}>{user.display} <span
                        className={"text-zinc-500 text-sm"}>(@{user.name})</span></p>
                    <p className={"text-md"}>Created at: {date.toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short"
                    })}</p>
                    <p className={"text-md"}>User ID: {user.id}</p>
                    <p>{ followers } Followers, { clout } Clout</p>
                    {user.bio ? <q>{user.bio}</q> : <p>No bio</p>}

                </div>

            </div>

        )

    }

    return (

        <div className={"flex flex-row gap-2"}>

            <img src={`/api/account/${user.id}/profile.jpeg?t=${epoch}`} alt={"pfp"}
                 className={"border-1 border-black"} width={128} height={128}/>

            <div>

                <p className={"flex flex-row gap-2 items-center text-2xl"}>{user.display} <span
                    className={"text-zinc-500 text-sm"}>(@{user.name})</span></p>
                <p className={"text-md"}>Created at: {date.toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short"
                })}</p>

                {
                    user.id != -1 ? (
                        <>
                            <p>{ followers } Followers, { clout } Clout</p>
                            {user.bio ? <q>{user.bio}</q> : <p>No bio</p>}
                            <FollowForm user={user} viewer={viewer ? viewer : undefined} following={following} />
                        </>
                    ) : null

                }

            </div>

        </div>

    )

}