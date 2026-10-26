import NavBar from "@/app/components/navbar/NavBar";
import Link from "next/link";

export default function NotFound() {

    return (

        <>

            <div className={"flex flex-col gap-4 w-full md:w-215 mt-0 m-auto p-5"}>

                <NavBar />

                <h1 className={"text-[#721C24] text-center text-6xl mt-10"}>404 Page not found</h1>
                <p className={"text-[#721C24] text-center text-2xl m-1"}>Go back to <Link href="/">home</Link></p>

            </div>

        </>

    )

}