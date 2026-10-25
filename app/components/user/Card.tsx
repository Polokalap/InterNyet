type Props = {
    user: {
        id: number;
        name: string;
        display: string;
        created: number;
    };
}

export default function Card({ user }: Props) {

    // eslint-disable-next-line react-hooks/purity
    const epoch = Date.now();
    const date = new Date(user.created * 1000);

    return (

        <div className={"flex flex-row gap-2"}>

            <img src={`/api/account/${user.id}/profile.jpeg?t=${epoch}`} alt={"pfp"} className={"border-1 border-black"} width={128} height={128} />

            <div className={"pt-2"}>

                <p className={"flex flex-row gap-2 items-center text-3xl"}>{ user.display } <span className={"text-zinc-500 text-sm"}>({ user.name })</span></p>
                <p className={"text-md"}>Created at: { date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) }</p>

            </div>

        </div>

    )

}