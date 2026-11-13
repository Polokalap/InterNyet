import { cookies } from "next/headers";
import { FileNotice } from "@/app/components/notice/Notice";
import Boards from "@/app/components/boards/Boards";
import NavBar from "@/app/components/navbar/NavBar";
import Palantir from "@/app/components/palantir/Palantir";
import Trending from "@/app/components/boards/Trending";

export default async function Home() {

    const storage = await cookies();

    const welcome = storage.has("welcome");

    return (

        <>

            <Palantir />

            <div className={"flex flex-col gap-4 w-full overflow-clip md:w-215 mt-0 m-auto md:p-5 p-2"}>

                <NavBar />

                {!welcome && <FileNotice title={"Welcome to InterNyet!"} file={"./notices/welcome.md"} id={"welcome-notice"} onClose={handleCloseWelcome} />}

                <Boards title={"Boards"}/>

                <Trending />

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