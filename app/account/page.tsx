import { requireUser } from "@/app/lib/auth";
import NavBar from "@/app/components/navbar/NavBar";

export default async function Page() {

    const user = await requireUser();

    return (

        <>

            <div className={"flex flex-col gap-10 w-full md:w-215 mt-0 m-auto pt-5 pb-5"}>

                <NavBar />

            </div>

        </>

    )

}