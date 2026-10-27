import { cookies } from "next/headers";
import { FileNotice } from "@/app/components/notice/Notice";
import Boards from "@/app/components/boards/Boards";
import NavBar from "@/app/components/navbar/NavBar";

export default async function Home() {

    const storage = await cookies();

    const welcome = storage.has("welcome");

    return (

        <>

            <div className={"flex flex-col gap-4 w-full md:w-215 mt-0 m-auto p-5"}>

                <NavBar />

                {!welcome && <FileNotice title={"Welcome to InterNyet!"} file={"./notices/welcome.md"} id={"welcome-notice"} onClose={handleCloseWelcome} />}

                <Boards title={"Boards"}/>

            </div>

        </>

    );

}

async function handleCloseWelcome() {

    "use server";

    const storage = await cookies();

    storage.set("welcome", "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
    });

}