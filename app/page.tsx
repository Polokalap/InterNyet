import Image from "next/image";
import Notice, { FileNotice } from "@/app/components/notice/Notice";
import Boards from "@/app/components/boards/Boards";

export default function Home() {

  return (

      <>

        <div className={"flex flex-col gap-4 w-full md:w-215 mt-0 m-auto pt-5 pb-5"}>

            <FileNotice title={"Welcome to InterNyet!"} file={"./notices/welcome.md"} />

            <Boards title={"Boards"} />

        </div>

      </>

  );

}
