import { logout } from "@/app/account/actions";
import NavBar from "@/app/components/navbar/NavBar";
import { requireUser } from "@/app/lib/auth"

export default async function Page() {

    const user = await requireUser();

    // await logout();
    // redirect("/account/login");

    return (

        <>

            <div className={"flex flex-col gap-10 w-full md:w-215 mt-0 m-auto pt-5 pb-5"}>

                <NavBar />

                <div className={"flex flex-col w-150 h-60 m-auto border-2 bg-[#FFF9F0] items-center"}>

                    <div className={"flex flex-row justify-between pl-1 pr-1 w-full border-b-1 bg-[#721C24] items-center"}>

                        <p className={"text-white font-bold text-lg"}>Log out</p>

                    </div>

                    <div className={"flex flex-col gap-4 items-center p-5"}>

                        <h1 className={"text-3xl font-bold"}>Are you sure you want to log out?</h1>

                        <p>Logging out will terminate this session, logging out any accounts that use the current session. You should ignore this, if you didn't share this session with another user.</p>

                        <div className={"flex flex-row w-full justify-evenly p-20 pt-3"}>

                            <form action={logout}>
                                <button type="submit" className={"button-primary scale-125"}>Yes, log out</button>
                            </form>
                            <a href={"/account"}><button className={"button-secondary scale-125"}>No, go back</button></a>

                        </div>

                    </div>

                </div>

            </div>

        </>

    )

}