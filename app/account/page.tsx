import { requireUser } from "@/app/lib/auth";

export default async function Page() {

    const user = await requireUser();

    return (

        <>



        </>

    )

}